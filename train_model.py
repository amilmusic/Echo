import json
import os
import pickle
from pathlib import Path

import pandas as pd

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")

from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler


DATASET_PATH = Path("synthetic_users.csv")
METADATA_PATH = Path("dataset_metadata.json")
CLUSTERED_CSV_PATH = Path("clustered_users.csv")
CLUSTERED_JSON_PATH = Path("clustered_users.json")
KMEANS_MODEL_PATH = Path("kmeans_model.pkl")
SCALER_PATH = Path("scaler.pkl")
PCA_MODEL_PATH = Path("pca_model.pkl")
CLUSTER_PROFILES_PATH = Path("cluster_profiles.json")

RANDOM_STATE = 42
N_CLUSTERS = 4

PROFILE_FEATURES = [
    "echo_chamber_score",
    "algorithmic_influence_score",
    "polarization_risk_score",
    "content_diversity_score",
    "agreeing_content_engagement",
    "opposing_content_engagement",
    "rabbit_hole_tendency",
    "feed_alignment_reaction",
    "in_moment_algorithm_awareness",
    "algorithm_resistance_behavior",
]


def load_metadata(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def validate_features(df, feature_columns):
    if "user_id" in feature_columns:
        raise ValueError("user_id must not be included in ml_feature_columns.")

    missing_columns = [column for column in feature_columns if column not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing feature columns in dataset: {missing_columns}")

    non_numeric_columns = df[feature_columns].select_dtypes(exclude="number").columns.tolist()
    if non_numeric_columns:
        raise ValueError(f"Training features must be numeric only: {non_numeric_columns}")


def save_pickle(model, path):
    with path.open("wb") as file:
        pickle.dump(model, file)


def suggest_persona_label(averages):
    echo = averages["echo_chamber_score"]
    algorithmic = averages["algorithmic_influence_score"]
    one_sidedness = averages["polarization_risk_score"]
    diversity = averages["content_diversity_score"]
    opposing = averages["opposing_content_engagement"]
    rabbit_hole = averages["rabbit_hole_tendency"]
    awareness = averages["in_moment_algorithm_awareness"]
    resistance = averages["algorithm_resistance_behavior"]
    agreeing = averages["agreeing_content_engagement"]

    # Labels are assigned from observed score patterns, not from cluster IDs.
    if diversity >= 58 and opposing >= 28 and awareness >= 3 and resistance >= 2.4 and echo <= 52 and one_sidedness <= 55:
        return "Reflective User"
    if echo >= 62 and one_sidedness >= 60 and diversity < 52 and opposing < 28 and (agreeing >= 35 or rabbit_hole >= 40):
        return "Echo Chamber User"
    if (algorithmic >= 50 and rabbit_hole >= 42) or (algorithmic >= 36 and rabbit_hole >= 38 and agreeing >= 35 and echo >= 45 and diversity < 55):
        return "Algorithm-Driven Engager"
    if awareness <= 2.5 and resistance <= 2.2 and agreeing <= 35 and rabbit_hole <= 45:
        return "Passive Scroller"
    return "Mixed Exposure User"


def describe_persona(label):
    descriptions = {
        "Passive Scroller": "Often scrolls through social and societal content with moderate reflection and relatively passive engagement patterns.",
        "Echo Chamber User": "Shows stronger signs of self-reinforcing exposure, lower engagement with opposing content, and higher echo chamber or polarization risk.",
        "Reflective User": "Shows broader content diversity, more awareness of algorithmic influence, and more openness toward other perspectives.",
        "Algorithm-Driven Engager": "Interacts strongly with content and similar recommendations, making the feed more likely to become personalized around repeated patterns.",
        "Mixed Exposure User": "Shows a blended pattern where some answers suggest breadth while others still create repeated or reinforcing feed signals.",
    }
    return descriptions[label]


def build_cluster_profiles(clustered_df):
    global_means = clustered_df[PROFILE_FEATURES].mean()
    profiles = []

    for cluster_id, group in clustered_df.groupby("cluster_id"):
        averages = group[PROFILE_FEATURES].mean().round(2).to_dict()
        differences = group[PROFILE_FEATURES].mean() - global_means
        top_features = []

        for feature, difference in differences.abs().sort_values(ascending=False).head(4).items():
            direction = "above_average" if differences[feature] > 0 else "below_average"
            top_features.append(
                {
                    "feature": feature,
                    "cluster_average": round(float(averages[feature]), 2),
                    "dataset_average": round(float(global_means[feature]), 2),
                    "difference": round(float(differences[feature]), 2),
                    "direction": direction,
                }
            )

        label = suggest_persona_label(averages)
        profiles.append(
            {
                "cluster_id": int(cluster_id),
                "size": int(len(group)),
                "percentage_of_users": round(float(len(group) / len(clustered_df) * 100), 2),
                "average_scores": {feature: float(value) for feature, value in averages.items()},
                "top_distinguishing_features": top_features,
                "suggested_persona_label": label,
                "short_description": describe_persona(label),
            }
        )

    return sorted(profiles, key=lambda profile: profile["cluster_id"])


def main():
    df = pd.read_csv(DATASET_PATH)
    metadata = load_metadata(METADATA_PATH)

    # The metadata file is the source of truth for ML feature selection.
    feature_columns = [column for column in metadata["ml_feature_columns"] if column != "user_id"]
    validate_features(df, feature_columns)

    feature_matrix = df[feature_columns]

    # KMeans is distance-based, so features are standardized before clustering.
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(feature_matrix)

    kmeans = KMeans(n_clusters=N_CLUSTERS, random_state=RANDOM_STATE, n_init=10)
    cluster_ids = kmeans.fit_predict(scaled_features)

    # PCA is used only for 2D visualization of the scaled feature matrix.
    pca = PCA(n_components=2, random_state=RANDOM_STATE)
    pca_coordinates = pca.fit_transform(scaled_features)

    clustered_df = df.copy()
    clustered_df["cluster_id"] = cluster_ids
    clustered_df["pca_x"] = pca_coordinates[:, 0]
    clustered_df["pca_y"] = pca_coordinates[:, 1]

    clustered_df.to_csv(CLUSTERED_CSV_PATH, index=False)
    CLUSTERED_JSON_PATH.write_text(
        json.dumps(clustered_df.to_dict(orient="records"), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    save_pickle(kmeans, KMEANS_MODEL_PATH)
    save_pickle(scaler, SCALER_PATH)
    save_pickle(pca, PCA_MODEL_PATH)

    cluster_profiles = build_cluster_profiles(clustered_df)
    CLUSTER_PROFILES_PATH.write_text(
        json.dumps(cluster_profiles, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Rows: {len(df)}")
    print(f"Features used: {len(feature_columns)}")
    print("\nCluster counts:")
    print(clustered_df["cluster_id"].value_counts().sort_index().to_string())
    print("\nPCA explained variance ratio:")
    print([round(float(value), 4) for value in pca.explained_variance_ratio_])
    print(f"\nCluster profiles saved: {CLUSTER_PROFILES_PATH.resolve()}")


if __name__ == "__main__":
    main()
