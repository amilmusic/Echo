(function () {
  const PLATFORM_COLUMNS = [
    "platform_tiktok",
    "platform_instagram",
    "platform_youtube",
    "platform_x_twitter",
    "platform_facebook",
    "platform_reddit",
  ];

  const TOPIC_COLUMNS = [
    "topic_climate",
    "topic_migration",
    "topic_economy",
    "topic_crime",
    "topic_equality",
    "topic_conflict",
    "topic_education",
    "topic_healthcare",
  ];

  const AGREE_COLUMNS = ["agree_like_comment", "agree_read_watch_full", "agree_save_share", "agree_scroll_past"];
  const OPPOSE_COLUMNS = ["oppose_scroll_past", "oppose_read_watch_full", "oppose_open_comments", "oppose_comment", "oppose_rarely_encounter"];
  const VIDEO_COLUMNS = ["video_gets_similar", "video_continue_watching", "video_search_more", "video_scroll_past"];

  const PROFILE_FEATURES = [
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
  ];

  const SCORE_COLUMNS = [
    "echo_chamber_score",
    "algorithmic_influence_score",
    "polarization_risk_score",
    "content_diversity_score",
  ];

  const PLATFORM_DISTANCE = {
    "platform_tiktok|platform_instagram": 0.25,
    "platform_tiktok|platform_youtube": 0.45,
    "platform_tiktok|platform_x_twitter": 0.8,
    "platform_tiktok|platform_facebook": 0.65,
    "platform_tiktok|platform_reddit": 0.85,
    "platform_instagram|platform_youtube": 0.5,
    "platform_instagram|platform_x_twitter": 0.75,
    "platform_instagram|platform_facebook": 0.4,
    "platform_instagram|platform_reddit": 0.8,
    "platform_youtube|platform_x_twitter": 0.65,
    "platform_youtube|platform_facebook": 0.55,
    "platform_youtube|platform_reddit": 0.65,
    "platform_x_twitter|platform_facebook": 0.45,
    "platform_x_twitter|platform_reddit": 0.55,
    "platform_facebook|platform_reddit": 0.65,
  };

  const SINGLE_CHOICE_ENCODINGS = {
    1: [3, 5, 4, 2, 1],
    3: [2, 1, 4, 5],
    4: [4, 3, 2, 1],
    5: [4, 3, 1, 2],
    6: [1, 3, 4, 2],
    10: [3, 5, 2, 1],
    11: [4, 3, 2, 1],
    12: [5, 4, 2, 1],
    13: [2, 1, 4, 5],
    14: [4, 3, 2, 1],
  };

  const DATA_PATHS = {
    profiles: "data/cluster_profiles.json",
    users: "data/clustered_users.json",
    config: "data/model_config.json",
  };

  let frontendDataPromise = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, digits = 1) {
    return Number(value.toFixed(digits));
  }

  function normalize(value, min, max) {
    return clamp(((value - min) / (max - min)) * 100, 0, 100);
  }

  function widenScore(value) {
    return clamp(50 + (value - 50) * 1.18, 0, 100);
  }

  function selectedIndexes(question, selectedAnswers) {
    return selectedAnswers.map((answer) => question.options.indexOf(answer)).filter((index) => index >= 0);
  }

  function platformDiversity(features) {
    const selected = PLATFORM_COLUMNS.filter((column) => features[column] > 0);
    const distances = [];

    selected.forEach((first, index) => {
      selected.slice(index + 1).forEach((second) => {
        distances.push(PLATFORM_DISTANCE[`${first}|${second}`] || PLATFORM_DISTANCE[`${second}|${first}`] || 0.5);
      });
    });

    if (!distances.length) return 0;
    return round((distances.reduce((sum, value) => sum + value, 0) / distances.length) * 100);
  }

  function encodeQuizAnswers(questions, answers) {
    const features = {};

    PLATFORM_COLUMNS.forEach((column) => {
      features[column] = 0;
    });
    TOPIC_COLUMNS.forEach((column) => {
      features[column] = 0;
    });
    [...AGREE_COLUMNS, ...OPPOSE_COLUMNS, ...VIDEO_COLUMNS].forEach((column) => {
      features[column] = 0;
    });

    const rankedPlatforms = answers[0] || [];
    rankedPlatforms.forEach((answer, index) => {
      const optionIndex = questions[0].options.indexOf(answer);
      if (optionIndex >= 0 && PLATFORM_COLUMNS[optionIndex]) {
        features[PLATFORM_COLUMNS[optionIndex]] = 3 - index;
      }
    });

    selectedIndexes(questions[2], answers[2] || []).forEach((index) => {
      if (TOPIC_COLUMNS[index]) features[TOPIC_COLUMNS[index]] = 1;
    });

    Object.entries(SINGLE_CHOICE_ENCODINGS).forEach(([questionIndex, values]) => {
      const index = selectedIndexes(questions[questionIndex], answers[questionIndex] || [])[0];
      const column = {
        1: "content_format_preference",
        3: "repetition_interpretation",
        4: "news_media_exposure",
        5: "missed_news_frequency",
        6: "perceived_feed_difference",
        10: "feed_alignment_reaction",
        11: "in_moment_algorithm_awareness",
        12: "algorithm_mechanism_understanding",
        13: "echo_chamber_reflection",
        14: "algorithm_resistance_behavior",
      }[questionIndex];
      features[column] = values[index] || 0;
    });

    selectedIndexes(questions[7], answers[7] || []).forEach((index) => {
      if (AGREE_COLUMNS[index]) features[AGREE_COLUMNS[index]] = 1;
    });
    selectedIndexes(questions[8], answers[8] || []).forEach((index) => {
      if (OPPOSE_COLUMNS[index]) features[OPPOSE_COLUMNS[index]] = 1;
    });
    selectedIndexes(questions[9], answers[9] || []).forEach((index) => {
      if (VIDEO_COLUMNS[index]) features[VIDEO_COLUMNS[index]] = 1;
    });

    features.platform_diversity_score = platformDiversity(features);
    features.topic_diversity_score = round((TOPIC_COLUMNS.reduce((sum, column) => sum + features[column], 0) / 3) * 100);

    return features;
  }

  function calculateScores(features) {
    // agreeing_content_engagement increases when the user rewards content they
    // already agree with. Scrolling past lowers the reinforcement signal.
    features.agreeing_content_engagement = round(
      clamp(
        features.agree_like_comment * 30 +
          features.agree_read_watch_full * 22 +
          features.agree_save_share * 34 -
          features.agree_scroll_past * 24,
        0,
        100
      )
    );

    // opposing_content_engagement estimates actual contact with other or
    // disagreeing viewpoints. Reading/watching and opening comments raise it;
    // scrolling past or rarely seeing such content lowers it.
    features.opposing_content_engagement = round(
      clamp(
        features.oppose_read_watch_full * 42 +
          features.oppose_open_comments * 28 +
          features.oppose_comment * 20 -
          features.oppose_scroll_past * 28 -
          features.oppose_rarely_encounter * 42,
        0,
        100
      )
    );

    // rabbit_hole_tendency captures repeated recommendation loops. Similar
    // recommendations and continued watching raise it; searching wider context
    // or scrolling away lowers it.
    features.rabbit_hole_tendency = round(
      clamp(
        features.video_gets_similar * 30 +
          features.video_continue_watching * 46 -
          features.video_search_more * 28 -
          features.video_scroll_past * 28,
        0,
        100
      )
    );

    const awareness = normalize(features.in_moment_algorithm_awareness, 1, 4);
    const resistance = normalize(features.algorithm_resistance_behavior, 1, 4);
    const reflection = normalize(features.echo_chamber_reflection, 1, 5);
    const feedAlignmentReflection = normalize(features.feed_alignment_reaction, 1, 5);
    const repetitionAwareness = normalize(features.repetition_interpretation, 1, 5);
    const newsExposure = normalize(features.news_media_exposure, 1, 4);
    const perceivedDifference = normalize(features.perceived_feed_difference, 1, 4);
    const missedNews = normalize(features.missed_news_frequency, 1, 4);

    const lowAwareness = 100 - normalize(features.in_moment_algorithm_awareness, 1, 4);
    const lowResistance = 100 - normalize(features.algorithm_resistance_behavior, 1, 4);
    const lowReflection = 100 - normalize(features.echo_chamber_reflection, 1, 5);
    const lowOpposition = 100 - features.opposing_content_engagement;
    const repetitionBlindness = 100 - repetitionAwareness;

    // content_diversity_score increases with varied platforms/topics/news,
    // opposing-viewpoint engagement, reflection, and active feed control. It is
    // reduced slightly by rabbit-hole loops because repeated content narrows
    // practical exposure even when selected topics are broad.
    features.content_diversity_score = round(
      widenScore(
        features.platform_diversity_score * 0.12 +
          features.topic_diversity_score * 0.2 +
          newsExposure * 0.17 +
          features.opposing_content_engagement * 0.25 +
          reflection * 0.12 +
          feedAlignmentReflection * 0.06 +
          resistance * 0.08 -
          features.rabbit_hole_tendency * 0.07
      )
    );

    // algorithmic_influence_score increases when answers send strong
    // personalization signals: repeated viewing loops and active engagement.
    // Awareness and resistance reduce it slightly, but do not erase behavior.
    features.algorithmic_influence_score = round(
      widenScore(
        features.rabbit_hole_tendency * 0.42 +
          features.agreeing_content_engagement * 0.24 +
          repetitionBlindness * 0.1 +
          lowResistance * 0.1 +
          lowAwareness * 0.06 +
          normalize(features.content_format_preference, 1, 5) * 0.04 -
          awareness * 0.06
      )
    );

    // echo_chamber_score is the BubbleIndex: an overall tendency toward a
    // repeated, reinforcing, and narrow information environment. It is pulled
    // down by diversity, opposing-viewpoint contact, awareness, and active
    // perspective-seeking behavior.
    features.echo_chamber_score = round(
      widenScore(
        features.rabbit_hole_tendency * 0.24 +
          features.agreeing_content_engagement * 0.16 +
          lowOpposition * 0.2 +
          (100 - features.content_diversity_score) * 0.22 +
          repetitionBlindness * 0.1 +
          lowReflection * 0.08 +
          lowResistance * 0.06 +
          features.algorithmic_influence_score * 0.1 -
          awareness * 0.05 -
          resistance * 0.05
      )
    );

    // polarization_risk_score estimates one-sidedness risk. High diversity and
    // opposing-viewpoint engagement reduce it; missed-news patterns, perceived
    // feed separation, algorithmic reinforcement, and BubbleIndex raise it.
    features.polarization_risk_score = round(
      widenScore(
        features.echo_chamber_score * 0.34 +
          (100 - features.content_diversity_score) * 0.26 +
          lowOpposition * 0.18 +
          missedNews * 0.1 +
          perceivedDifference * 0.08 +
          features.algorithmic_influence_score * 0.08 -
          awareness * 0.05 -
          resistance * 0.05
      )
    );

    return features;
  }

  function distanceToProfile(features, profile) {
    return PROFILE_FEATURES.reduce((sum, feature) => {
      const max = feature.includes("_reaction") || feature.includes("_awareness") || feature.includes("_behavior") ? 5 : 100;
      const difference = (features[feature] - profile.average_scores[feature]) / max;
      return sum + difference * difference;
    }, 0);
  }

  function nearestProfile(features, profiles) {
    return profiles.reduce((best, profile) => {
      const distance = distanceToProfile(features, profile);
      if (!best || distance < best.distance) return { profile, distance };
      return best;
    }, null).profile;
  }

  function classifyBehaviorProfile(features) {
    const echo = features.echo_chamber_score;
    const algorithmic = features.algorithmic_influence_score;
    const oneSidedness = features.polarization_risk_score;
    const diversity = features.content_diversity_score;
    const opposing = features.opposing_content_engagement;
    const rabbitHole = features.rabbit_hole_tendency;
    const awareness = features.in_moment_algorithm_awareness;
    const resistance = features.algorithm_resistance_behavior;
    const agreeing = features.agreeing_content_engagement;

    if (diversity >= 58 && opposing >= 28 && awareness >= 3 && resistance >= 2.4 && echo <= 52 && oneSidedness <= 55) {
      return "Reflective User";
    }
    if (echo >= 62 && oneSidedness >= 60 && diversity < 52 && opposing < 28 && (agreeing >= 35 || rabbitHole >= 40)) {
      return "Echo Chamber User";
    }
    if ((algorithmic >= 50 && rabbitHole >= 42) || (algorithmic >= 36 && rabbitHole >= 38 && agreeing >= 35 && echo >= 45 && diversity < 55)) {
      return "Algorithm-Driven Engager";
    }
    if (awareness <= 2.5 && resistance <= 2.2 && agreeing <= 35 && rabbitHole <= 45) {
      return "Passive Scroller";
    }
    return "Mixed Exposure User";
  }

  function nearestPcaPosition(features, users, clusterId) {
    const candidates = users.filter((user) => user.cluster_id === clusterId);
    const pool = candidates.length ? candidates : users;
    if (!pool.length) return null;

    return pool.reduce((best, user) => {
      const distance = SCORE_COLUMNS.reduce((sum, column) => {
        const difference = (features[column] - user[column]) / 100;
        return sum + difference * difference;
      }, 0);
      if (!best || distance < best.distance) return { user, distance };
      return best;
    }, null).user;
  }

  function explanationFor(profile, scores) {
    const strongestScore = SCORE_COLUMNS.reduce((best, column) => (scores[column] > scores[best] ? column : best), SCORE_COLUMNS[0]);
    const scoreNames = {
      echo_chamber_score: "echo chamber tendency",
      algorithmic_influence_score: "algorithmic influence",
      polarization_risk_score: "polarization risk",
      content_diversity_score: "content diversity",
    };

    return `${profile.short_description} Your strongest signal is ${scoreNames[strongestScore]}, based on how your answers map to repeated content, engagement, awareness, and diversity patterns.`;
  }

  async function loadFrontendData() {
    if (!frontendDataPromise) {
      frontendDataPromise = Promise.all([
        fetch(DATA_PATHS.profiles).then((response) => response.json()),
        fetch(DATA_PATHS.users).then((response) => response.json()),
        fetch(DATA_PATHS.config).then((response) => response.json()),
      ]).then(([profiles, users, config]) => ({ profiles, users, config }));
    }
    return frontendDataPromise;
  }

  async function scoreQuizResult(questions, answers) {
    const features = calculateScores(encodeQuizAnswers(questions, answers));
    const scores = Object.fromEntries(SCORE_COLUMNS.map((column) => [column, features[column]]));

    try {
      const { profiles, users, config } = await loadFrontendData();
      const profile = nearestProfile(features, profiles);
      const pcaUser = nearestPcaPosition(features, users, profile.cluster_id);
      const personaLabel = classifyBehaviorProfile(features);

      return {
        personaLabel,
        scores,
        explanation: explanationFor(profile, scores),
        clusterId: profile.cluster_id,
        pcaPosition: pcaUser ? { x: pcaUser.pca_x, y: pcaUser.pca_y } : null,
        features,
        modelConfig: config,
      };
    } catch (error) {
      return {
        personaLabel: "Quiz profile",
        scores,
        explanation: "Your result is based on the quiz scoring logic. Cluster profile data could not be loaded in this browser context.",
        clusterId: null,
        pcaPosition: null,
        features,
        modelConfig: null,
        error,
      };
    }
  }

  window.QuizScoring = {
    encodeQuizAnswers,
    calculateScores,
    loadFrontendData,
    scoreQuizResult,
  };
})();
