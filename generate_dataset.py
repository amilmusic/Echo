import argparse
import json
import random
from pathlib import Path

import numpy as np
import pandas as pd


DEFAULT_USER_COUNT = 8000
SEED = 42


PLATFORMS = ["tiktok", "instagram", "youtube", "x_twitter", "facebook", "reddit"]
TOPICS = ["climate", "migration", "economy", "crime", "equality", "conflict", "education", "healthcare"]

# Single-choice answers are generated as labels internally, then encoded into
# numeric values before export. Higher values generally mean stronger awareness,
# stronger engagement, or stronger exposure depending on the question.
ENCODINGS = {
    "content_format_preference": {
        "rarely_stops": 1,
        "comments_discussions": 2,
        "short_video": 3,
        "text_articles": 4,
        "long_reportage": 5,
    },
    "repetition_interpretation": {
        "coincidence": 1,
        "important_issue": 2,
        "algorithm_detected": 4,
        "seek_other_perspectives": 5,
    },
    "news_media_exposure": {
        "never_influencers_private": 1,
        "rarely": 2,
        "weekly": 3,
        "daily": 4,
    },
    "missed_news_frequency": {
        "rarely": 1,
        "not_sure": 2,
        "sometimes": 3,
        "often": 4,
    },
    "perceived_feed_difference": {
        "similar": 1,
        "not_sure": 2,
        "somewhat_different": 3,
        "very_different": 4,
    },
    "feed_alignment_reaction": {
        "not_thought_about_it": 1,
        "normal_everyone_has_feed": 2,
        "more_personal": 3,
        "want_more_perspectives": 5,
    },
    "in_moment_algorithm_awareness": {
        "never": 1,
        "rarely": 2,
        "sometimes": 3,
        "often": 4,
    },
    "algorithm_mechanism_understanding": {
        "no_clear_reason": 1,
        "friends_behavior": 2,
        "watch_time": 4,
        "active_engagement": 5,
    },
    "echo_chamber_reflection": {
        "do_not_reflect": 1,
        "natural_comfortable": 2,
        "curious_what_missing": 4,
        "actively_seek_perspectives": 5,
    },
    "algorithm_resistance_behavior": {
        "never": 1,
        "thought_about_it": 2,
        "tried_once": 3,
        "yes_sometimes": 4,
    },
}


PERSONAS = {
    "Passive Scroller": {
        "share": 0.28,
        "platform_weights": [0.30, 0.27, 0.20, 0.06, 0.10, 0.07],
        "content_weights": [0.48, 0.08, 0.12, 0.10, 0.22],
        "topic_weights": [0.12, 0.14, 0.10, 0.22, 0.08, 0.15, 0.09, 0.10],
        "question_weights": {
            "repetition_interpretation": [0.42, 0.18, 0.25, 0.15],
            "news_media_exposure": [0.18, 0.34, 0.34, 0.14],
            "missed_news_frequency": [0.26, 0.40, 0.16, 0.18],
            "perceived_feed_difference": [0.22, 0.38, 0.18, 0.22],
            "feed_alignment_reaction": [0.34, 0.18, 0.30, 0.18],
            "in_moment_algorithm_awareness": [0.08, 0.25, 0.42, 0.25],
            "algorithm_mechanism_understanding": [0.22, 0.24, 0.23, 0.31],
            "echo_chamber_reflection": [0.34, 0.32, 0.20, 0.14],
            "algorithm_resistance_behavior": [0.06, 0.14, 0.30, 0.50],
        },
        "multi_weights": {
            "agree": [0.35, 0.58, 0.18, 0.45],
            "oppose": [0.62, 0.23, 0.20, 0.05, 0.28],
            "video": [0.56, 0.30, 0.18, 0.42],
        },
    },
    "Echo Chamber User": {
        "share": 0.18,
        "platform_weights": [0.33, 0.24, 0.16, 0.12, 0.10, 0.05],
        "content_weights": [0.42, 0.05, 0.10, 0.30, 0.13],
        "topic_weights": [0.08, 0.19, 0.14, 0.25, 0.07, 0.14, 0.05, 0.08],
        "question_weights": {
            "repetition_interpretation": [0.52, 0.18, 0.22, 0.08],
            "news_media_exposure": [0.14, 0.26, 0.38, 0.22],
            "missed_news_frequency": [0.32, 0.38, 0.12, 0.18],
            "perceived_feed_difference": [0.14, 0.28, 0.42, 0.16],
            "feed_alignment_reaction": [0.48, 0.08, 0.32, 0.12],
            "in_moment_algorithm_awareness": [0.10, 0.26, 0.38, 0.26],
            "algorithm_mechanism_understanding": [0.36, 0.30, 0.16, 0.18],
            "echo_chamber_reflection": [0.52, 0.26, 0.14, 0.08],
            "algorithm_resistance_behavior": [0.04, 0.09, 0.22, 0.65],
        },
        "multi_weights": {
            "agree": [0.56, 0.64, 0.34, 0.16],
            "oppose": [0.66, 0.12, 0.26, 0.16, 0.38],
            "video": [0.70, 0.56, 0.16, 0.14],
        },
    },
    "Reflective User": {
        "share": 0.22,
        "platform_weights": [0.17, 0.18, 0.21, 0.11, 0.09, 0.24],
        "content_weights": [0.22, 0.22, 0.28, 0.18, 0.10],
        "topic_weights": [0.16, 0.13, 0.11, 0.13, 0.15, 0.13, 0.10, 0.09],
        "question_weights": {
            "repetition_interpretation": [0.12, 0.05, 0.33, 0.50],
            "news_media_exposure": [0.34, 0.42, 0.18, 0.06],
            "missed_news_frequency": [0.12, 0.28, 0.44, 0.16],
            "perceived_feed_difference": [0.08, 0.32, 0.48, 0.12],
            "feed_alignment_reaction": [0.12, 0.48, 0.14, 0.26],
            "in_moment_algorithm_awareness": [0.48, 0.36, 0.12, 0.04],
            "algorithm_mechanism_understanding": [0.32, 0.38, 0.20, 0.10],
            "echo_chamber_reflection": [0.10, 0.08, 0.36, 0.46],
            "algorithm_resistance_behavior": [0.28, 0.30, 0.28, 0.14],
        },
        "multi_weights": {
            "agree": [0.22, 0.60, 0.22, 0.34],
            "oppose": [0.24, 0.56, 0.38, 0.08, 0.08],
            "video": [0.42, 0.24, 0.62, 0.22],
        },
    },
    "Algorithm-Driven Engager": {
        "share": 0.20,
        "platform_weights": [0.36, 0.26, 0.18, 0.08, 0.05, 0.07],
        "content_weights": [0.55, 0.06, 0.10, 0.19, 0.10],
        "topic_weights": [0.11, 0.15, 0.11, 0.20, 0.09, 0.18, 0.07, 0.09],
        "question_weights": {
            "repetition_interpretation": [0.32, 0.06, 0.46, 0.16],
            "news_media_exposure": [0.22, 0.36, 0.30, 0.12],
            "missed_news_frequency": [0.24, 0.42, 0.20, 0.14],
            "perceived_feed_difference": [0.10, 0.32, 0.44, 0.14],
            "feed_alignment_reaction": [0.40, 0.20, 0.22, 0.18],
            "in_moment_algorithm_awareness": [0.22, 0.42, 0.26, 0.10],
            "algorithm_mechanism_understanding": [0.48, 0.34, 0.12, 0.06],
            "echo_chamber_reflection": [0.38, 0.18, 0.28, 0.16],
            "algorithm_resistance_behavior": [0.14, 0.20, 0.34, 0.32],
        },
        "multi_weights": {
            "agree": [0.66, 0.68, 0.46, 0.10],
            "oppose": [0.38, 0.32, 0.46, 0.24, 0.18],
            "video": [0.76, 0.72, 0.34, 0.08],
        },
    },
    "News-Oriented Explorer": {
        "share": 0.12,
        "platform_weights": [0.10, 0.14, 0.23, 0.15, 0.16, 0.22],
        "content_weights": [0.12, 0.30, 0.35, 0.16, 0.07],
        "topic_weights": [0.14, 0.12, 0.16, 0.12, 0.12, 0.15, 0.08, 0.11],
        "question_weights": {
            "repetition_interpretation": [0.16, 0.06, 0.30, 0.48],
            "news_media_exposure": [0.56, 0.34, 0.08, 0.02],
            "missed_news_frequency": [0.08, 0.24, 0.56, 0.12],
            "perceived_feed_difference": [0.14, 0.36, 0.38, 0.12],
            "feed_alignment_reaction": [0.10, 0.44, 0.20, 0.26],
            "in_moment_algorithm_awareness": [0.34, 0.42, 0.18, 0.06],
            "algorithm_mechanism_understanding": [0.24, 0.30, 0.28, 0.18],
            "echo_chamber_reflection": [0.12, 0.10, 0.42, 0.36],
            "algorithm_resistance_behavior": [0.20, 0.28, 0.32, 0.20],
        },
        "multi_weights": {
            "agree": [0.20, 0.62, 0.28, 0.30],
            "oppose": [0.28, 0.58, 0.32, 0.06, 0.06],
            "video": [0.34, 0.22, 0.66, 0.24],
        },
    },
}


CONTENT_OPTIONS = ["short_video", "long_reportage", "text_articles", "comments_discussions", "rarely_stops"]
SINGLE_CHOICE_OPTIONS = {
    "repetition_interpretation": ["important_issue", "coincidence", "algorithm_detected", "seek_other_perspectives"],
    "news_media_exposure": ["daily", "weekly", "rarely", "never_influencers_private"],
    "missed_news_frequency": ["often", "sometimes", "rarely", "not_sure"],
    "perceived_feed_difference": ["similar", "somewhat_different", "very_different", "not_sure"],
    "feed_alignment_reaction": ["more_personal", "want_more_perspectives", "normal_everyone_has_feed", "not_thought_about_it"],
    "in_moment_algorithm_awareness": ["often", "sometimes", "rarely", "never"],
    "algorithm_mechanism_understanding": ["active_engagement", "watch_time", "friends_behavior", "no_clear_reason"],
    "echo_chamber_reflection": ["natural_comfortable", "do_not_reflect", "curious_what_missing", "actively_seek_perspectives"],
    "algorithm_resistance_behavior": ["yes_sometimes", "tried_once", "thought_about_it", "never"],
}
AGREE_COLUMNS = ["agree_like_comment", "agree_read_watch_full", "agree_save_share", "agree_scroll_past"]
OPPOSE_COLUMNS = ["oppose_scroll_past", "oppose_read_watch_full", "oppose_open_comments", "oppose_comment", "oppose_rarely_encounter"]
VIDEO_COLUMNS = ["video_gets_similar", "video_continue_watching", "video_search_more", "video_scroll_past"]

PLATFORM_DISTANCE = {
    ("tiktok", "instagram"): 0.25,
    ("tiktok", "youtube"): 0.45,
    ("tiktok", "x_twitter"): 0.80,
    ("tiktok", "facebook"): 0.65,
    ("tiktok", "reddit"): 0.85,
    ("instagram", "youtube"): 0.50,
    ("instagram", "x_twitter"): 0.75,
    ("instagram", "facebook"): 0.40,
    ("instagram", "reddit"): 0.80,
    ("youtube", "x_twitter"): 0.65,
    ("youtube", "facebook"): 0.55,
    ("youtube", "reddit"): 0.65,
    ("x_twitter", "facebook"): 0.45,
    ("x_twitter", "reddit"): 0.55,
    ("facebook", "reddit"): 0.65,
}


EXPORT_COLUMNS = [
    "user_id",
    "platform_tiktok",
    "platform_instagram",
    "platform_youtube",
    "platform_x_twitter",
    "platform_facebook",
    "platform_reddit",
    "platform_diversity_score",
    "content_format_preference",
    "topic_climate",
    "topic_migration",
    "topic_economy",
    "topic_crime",
    "topic_equality",
    "topic_conflict",
    "topic_education",
    "topic_healthcare",
    "topic_diversity_score",
    "repetition_interpretation",
    "news_media_exposure",
    "missed_news_frequency",
    "perceived_feed_difference",
    "agree_like_comment",
    "agree_read_watch_full",
    "agree_save_share",
    "agree_scroll_past",
    "agreeing_content_engagement",
    "oppose_scroll_past",
    "oppose_read_watch_full",
    "oppose_open_comments",
    "oppose_comment",
    "oppose_rarely_encounter",
    "opposing_content_engagement",
    "video_gets_similar",
    "video_continue_watching",
    "video_search_more",
    "video_scroll_past",
    "rabbit_hole_tendency",
    "feed_alignment_reaction",
    "in_moment_algorithm_awareness",
    "algorithm_mechanism_understanding",
    "echo_chamber_reflection",
    "algorithm_resistance_behavior",
    "echo_chamber_score",
    "algorithmic_influence_score",
    "polarization_risk_score",
    "content_diversity_score",
]


def weighted_choice(options, weights):
    return random.choices(options, weights=weights, k=1)[0]


def weighted_sample(options, weights, count):
    normalized = np.array(weights, dtype=float)
    normalized = normalized / normalized.sum()
    return list(np.random.choice(options, size=count, replace=False, p=normalized))


def choose_multi(columns, probabilities, max_count):
    # Multi-select quiz questions are simulated independently, then capped.
    # This gives realistic combinations while still matching the quiz limits.
    selected = [column for column, probability in zip(columns, probabilities) if random.random() < probability]
    if not selected:
        selected = [columns[int(np.argmax(probabilities))]]
    if len(selected) > max_count:
        selected = random.sample(selected, max_count)
    return selected


def normalize(value, min_value, max_value):
    return float(np.clip((value - min_value) / (max_value - min_value) * 100, 0, 100))


def widen_score(value):
    return float(np.clip(50 + (value - 50) * 1.18, 0, 100))


def platform_diversity(row):
    selected = [platform for platform in PLATFORMS if row[f"platform_{platform}"] > 0]
    distances = []
    for index, first in enumerate(selected):
        for second in selected[index + 1 :]:
            distances.append(PLATFORM_DISTANCE.get((first, second), PLATFORM_DISTANCE.get((second, first), 0.5)))
    return round(float(np.mean(distances) * 100), 1)


def add_scores(row):
    # Aggregated behavior scores are derived from numeric quiz encodings only.
    row["platform_diversity_score"] = platform_diversity(row)
    row["topic_diversity_score"] = round(sum(row[f"topic_{topic}"] for topic in TOPICS) / 3 * 100, 1)

    # agreeing_content_engagement increases when the user actively rewards content
    # they already agree with. Scrolling past lowers it because it gives weaker
    # reinforcement signals to the platform.
    row["agreeing_content_engagement"] = round(
        np.clip(
            row["agree_like_comment"] * 30
            + row["agree_read_watch_full"] * 22
            + row["agree_save_share"] * 34
            - row["agree_scroll_past"] * 24,
            0,
            100,
        ),
        1,
    )
    # opposing_content_engagement estimates actual contact with disagreeing or
    # different viewpoints. Reading, watching, and opening comments raise it;
    # scrolling past or rarely seeing such content lowers it.
    row["opposing_content_engagement"] = round(
        np.clip(
            row["oppose_read_watch_full"] * 42
            + row["oppose_open_comments"] * 28
            + row["oppose_comment"] * 20
            - row["oppose_scroll_past"] * 28
            - row["oppose_rarely_encounter"] * 42,
            0,
            100,
        ),
        1,
    )
    # rabbit_hole_tendency captures repeated recommendation loops. Getting more
    # similar videos and continuing to watch them increases it; searching more
    # broadly or scrolling away reduces it.
    row["rabbit_hole_tendency"] = round(
        np.clip(
            row["video_gets_similar"] * 30
            + row["video_continue_watching"] * 46
            - row["video_search_more"] * 28
            - row["video_scroll_past"] * 28,
            0,
            100,
        ),
        1,
    )

    awareness = normalize(row["in_moment_algorithm_awareness"], 1, 4)
    resistance = normalize(row["algorithm_resistance_behavior"], 1, 4)
    reflection = normalize(row["echo_chamber_reflection"], 1, 5)
    feed_alignment_reflection = normalize(row["feed_alignment_reaction"], 1, 5)
    repetition_awareness = normalize(row["repetition_interpretation"], 1, 5)
    news_exposure = normalize(row["news_media_exposure"], 1, 4)
    perceived_difference = normalize(row["perceived_feed_difference"], 1, 4)
    missed_news = normalize(row["missed_news_frequency"], 1, 4)

    low_awareness = 100 - awareness
    low_resistance = 100 - resistance
    low_reflection = 100 - reflection
    low_opposition = 100 - row["opposing_content_engagement"]
    repetition_blindness = 100 - repetition_awareness

    # content_diversity_score increases with varied platforms/topics/news,
    # genuine engagement with other viewpoints, and active reflection. It is
    # reduced slightly by rabbit-hole behavior because repeated loops narrow
    # the practical information environment even when topic selection is broad.
    content_diversity = widen_score(
        row["platform_diversity_score"] * 0.12
        + row["topic_diversity_score"] * 0.20
        + news_exposure * 0.17
        + row["opposing_content_engagement"] * 0.25
        + reflection * 0.12
        + feed_alignment_reflection * 0.06
        + resistance * 0.08
        - row["rabbit_hole_tendency"] * 0.07
        + np.random.normal(0, 2.2)
    )

    # algorithmic_influence_score increases when the user sends strong
    # personalization signals: similar-video loops and active engagement.
    # Awareness and resistance reduce it slightly, but do not erase behavior.
    algorithmic = widen_score(
        row["rabbit_hole_tendency"] * 0.42
        + row["agreeing_content_engagement"] * 0.24
        + repetition_blindness * 0.10
        + low_resistance * 0.10
        + low_awareness * 0.06
        + normalize(row["content_format_preference"], 1, 5) * 0.04
        - awareness * 0.06
        + np.random.normal(0, 2.2)
    )

    # echo_chamber_score is the BubbleIndex: an overall tendency toward a
    # repeated, reinforcing, and narrow feed. High scores require several
    # reinforcing signals and are pulled down by diversity, opposition, and
    # active perspective-seeking behavior.
    echo = widen_score(
        row["rabbit_hole_tendency"] * 0.24
        + row["agreeing_content_engagement"] * 0.16
        + low_opposition * 0.20
        + (100 - content_diversity) * 0.22
        + repetition_blindness * 0.10
        + low_reflection * 0.08
        + low_resistance * 0.06
        + algorithmic * 0.10
        - awareness * 0.05
        - resistance * 0.05
        + np.random.normal(0, 2.2)
    )

    # polarization_risk_score estimates one-sidedness risk. It is strongly
    # lowered by high content diversity and opposing-viewpoint engagement, and
    # raised by missed-news patterns and perceived feed separation.
    polarization = widen_score(
        echo * 0.34
        + (100 - content_diversity) * 0.26
        + low_opposition * 0.18
        + missed_news * 0.10
        + perceived_difference * 0.08
        + algorithmic * 0.08
        - awareness * 0.05
        - resistance * 0.05
        + np.random.normal(0, 2.2)
    )

    row["echo_chamber_score"] = round(float(np.clip(echo, 0, 100)), 1)
    row["algorithmic_influence_score"] = round(float(np.clip(algorithmic, 0, 100)), 1)
    row["polarization_risk_score"] = round(float(np.clip(polarization, 0, 100)), 1)
    row["content_diversity_score"] = round(float(np.clip(content_diversity, 0, 100)), 1)


def generate_user(user_id):
    persona_names = list(PERSONAS)
    persona = weighted_choice(persona_names, [PERSONAS[name]["share"] for name in persona_names])
    profile = PERSONAS[persona]

    row = {"user_id": user_id}

    # Ranking question: first choice = 3, second = 2, third = 1, not selected = 0.
    ranked_platforms = weighted_sample(PLATFORMS, profile["platform_weights"], 3)
    for platform in PLATFORMS:
        row[f"platform_{platform}"] = 3 - ranked_platforms.index(platform) if platform in ranked_platforms else 0

    content_label = weighted_choice(CONTENT_OPTIONS, profile["content_weights"])
    row["content_format_preference"] = ENCODINGS["content_format_preference"][content_label]

    selected_topics = weighted_sample(TOPICS, profile["topic_weights"], random.randint(1, 3))
    for topic in TOPICS:
        row[f"topic_{topic}"] = int(topic in selected_topics)

    for question, options in SINGLE_CHOICE_OPTIONS.items():
        answer = weighted_choice(options, profile["question_weights"][question])
        row[question] = ENCODINGS[question][answer]

    for column in AGREE_COLUMNS + OPPOSE_COLUMNS + VIDEO_COLUMNS:
        row[column] = 0
    for column in choose_multi(AGREE_COLUMNS, profile["multi_weights"]["agree"], 2):
        row[column] = 1
    for column in choose_multi(OPPOSE_COLUMNS, profile["multi_weights"]["oppose"], 2):
        row[column] = 1
    for column in choose_multi(VIDEO_COLUMNS, profile["multi_weights"]["video"], 2):
        row[column] = 1

    add_scores(row)
    return row


def generate_dataset(user_count):
    df = pd.DataFrame(generate_user(user_id) for user_id in range(1, user_count + 1))
    return df[EXPORT_COLUMNS]


def export_dataset(df, output_dir):
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_path = output_dir / "synthetic_users.csv"
    json_path = output_dir / "synthetic_users.json"
    df.to_csv(csv_path, index=False)
    json_path.write_text(json.dumps(df.to_dict(orient="records"), ensure_ascii=False, indent=2), encoding="utf-8")
    return csv_path, json_path


def parse_args():
    parser = argparse.ArgumentParser(description="Generate numeric synthetic quiz data for ML experiments.")
    parser.add_argument("--users", type=int, default=DEFAULT_USER_COUNT, help="Number of users to generate, from 5000 to 10000.")
    parser.add_argument("--output-dir", type=Path, default=Path("."), help="Output directory for CSV and JSON exports.")
    return parser.parse_args()


def main():
    args = parse_args()
    if not 5000 <= args.users <= 10000:
        raise ValueError("--users must be between 5000 and 10000")

    random.seed(SEED)
    np.random.seed(SEED)

    df = generate_dataset(args.users)
    csv_path, json_path = export_dataset(df, args.output_dir)

    print(f"Generated {len(df)} numeric synthetic users")
    print(f"CSV: {csv_path.resolve()}")
    print(f"JSON: {json_path.resolve()}")
    print("\nColumns:")
    print(", ".join(df.columns))
    print("\nScore summary:")
    print(df[["echo_chamber_score", "algorithmic_influence_score", "polarization_risk_score", "content_diversity_score"]].describe().round(1))


if __name__ == "__main__":
    main()
