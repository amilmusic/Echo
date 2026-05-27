import json
from pathlib import Path

import pandas as pd


CLUSTERED_USERS_PATH = Path("clustered_users.csv")
CLUSTER_PROFILES_PATH = Path("cluster_profiles.json")
METADATA_PATH = Path("dataset_metadata.json")
DATA_DIR = Path("data")

FRONTEND_USER_COLUMNS = [
    "user_id",
    "cluster_id",
    "pca_x",
    "pca_y",
    "echo_chamber_score",
    "algorithmic_influence_score",
    "polarization_risk_score",
    "content_diversity_score",
]

SCORE_COLUMNS = [
    "echo_chamber_score",
    "algorithmic_influence_score",
    "polarization_risk_score",
    "content_diversity_score",
]


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def export_lightweight_users(df):
    users = df[FRONTEND_USER_COLUMNS].copy()
    users["pca_x"] = users["pca_x"].round(4)
    users["pca_y"] = users["pca_y"].round(4)
    for column in SCORE_COLUMNS:
        users[column] = users[column].round(1)

    write_json(DATA_DIR / "clustered_users.json", users.to_dict(orient="records"))


def export_cluster_profiles(profiles):
    frontend_profiles = []
    for profile in profiles:
        frontend_profiles.append(
            {
                "cluster_id": profile["cluster_id"],
                "size": profile["size"],
                "percentage_of_users": profile["percentage_of_users"],
                "persona_label": profile["suggested_persona_label"],
                "short_description": profile["short_description"],
                "average_scores": profile["average_scores"],
                "top_distinguishing_features": profile["top_distinguishing_features"],
            }
        )

    write_json(DATA_DIR / "cluster_profiles.json", frontend_profiles)


def export_model_config(metadata):
    config = {
        "ml_feature_columns": metadata["ml_feature_columns"],
        "score_columns": SCORE_COLUMNS,
        "score_interpretation": metadata.get("score_interpretation", {}),
        "cluster_count": 4,
        "pca_explanation": "PCA reduces the scaled ML feature matrix to two dimensions, pca_x and pca_y, so clusters can be visualized in a 2D scatter plot. The PCA coordinates are for visualization, not for explaining all variation in the data.",
        "feature_scaling_explanation": "Before KMeans clustering, all ML features are standardized with StandardScaler so each feature has comparable influence regardless of its original scale. This prevents 0-100 score columns from dominating binary or ordinal quiz columns.",
    }
    write_json(DATA_DIR / "model_config.json", config)


def main():
    DATA_DIR.mkdir(exist_ok=True)

    clustered_df = pd.read_csv(CLUSTERED_USERS_PATH)
    profiles = load_json(CLUSTER_PROFILES_PATH)
    metadata = load_json(METADATA_PATH)

    missing_columns = [column for column in FRONTEND_USER_COLUMNS if column not in clustered_df.columns]
    if missing_columns:
        raise ValueError(f"Missing columns in clustered users dataset: {missing_columns}")

    export_lightweight_users(clustered_df)
    export_cluster_profiles(profiles)
    export_model_config(metadata)

    print(f"Exported frontend data to {DATA_DIR.resolve()}")
    print(f"Users exported: {len(clustered_df)}")
    print(f"Profiles exported: {len(profiles)}")


if __name__ == "__main__":
    main()
