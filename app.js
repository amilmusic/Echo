const routes = ["home", "upload", "quiz", "results"];

const questions = [
  {
    section: "Sektion 1 · Innehållsexponering",
    text: "På vilka plattformar exponeras du av innehåll relaterat till politiska nyheter och samhällsdebatt?",
    helper: "Välj och rangordna tre alternativ. Klicka i den ordning som stämmer bäst.",
    type: "rank",
    max: 3,
    options: ["TikTok", "Instagram", "YouTube", "X / Twitter", "Facebook", "Reddit"],
  },
  {
    section: "Sektion 1 · Innehållsexponering",
    text: "Vilken typ av innehåll om samhällsfrågor stannar du oftast vid?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Korta videos eller reels", "Längre reportage eller dokumentärer", "Textinlägg eller artiklar", "Kommentarsfält och diskussioner", "Jag stannar sällan vid den typen av innehåll"],
  },
  {
    section: "Sektion 1 · Innehållsexponering",
    text: "Vilket av följande politiska områden anser du återkomma ofta i ditt flöde just nu?",
    helper: "Välj upp till tre alternativ.",
    type: "checkbox",
    max: 3,
    options: ["Klimat och miljö", "Migration och integration", "Ekonomi och skatter", "Kriminalitet och trygghet", "Jämställdhet och rättigheter", "Krig och internationella konflikter", "Skola och utbildning", "Hälsa och sjukvård"],
  },
  {
    section: "Sektion 2 · Algoritmiska mönster",
    text: "Du scrollar och ser tre inlägg i rad om samma politiska fråga, alla med liknande vinkel. Vad tänker du?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Att det verkar vara en viktig fråga just nu", "Att det är en slump", "Att algoritmen har plockat upp att jag gillar det", "Att jag kanske borde söka upp andra perspektiv"],
  },
  {
    section: "Sektion 2 · Algoritmiska mönster",
    text: "Hur ofta ser du innehåll från nyhetsmedier (t.ex. SVT, Aftonbladet, DN) i ditt sociala medier flöde?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Dagligen", "Några gånger i veckan", "Sällan", "Aldrig - jag ser mest innehåll från privatpersoner eller influencers"],
  },
  {
    section: "Sektion 2 · Algoritmiska mönster",
    text: "En vän skickar en nyhet till dig som du inte sett i ditt eget flöde. Hur ofta händer det att du missat nyheter som andra runt dig känner till?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Ofta", "Ibland", "Sällan", "Jag vet inte, jag jämför inte så mycket"],
  },
  {
    section: "Sektion 2 · Algoritmiska mönster",
    text: "Om du jämför ditt flöde med en vän med andra politiska åsikter än dig - hur tror du att era flöden skiljer sig?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Ganska lika, vi ser nog ungefär samma saker", "Lite olika, men inte dramatiskt", "Väldigt olika, jag tror vi lever i olika informationsflöden", "Jag vet inte"],
  },
  {
    section: "Sektion 3 · Reaktioner",
    text: "Du ser ett inlägg om en samhällsfråga som du direkt håller med om. Vad gör du oftast?",
    helper: "Välj upp till två alternativ.",
    type: "checkbox",
    max: 2,
    options: ["Gillar eller kommenterar", "Läser/tittar klart", "Sparar/skickar vidare", "Scrollar vidare"],
  },
  {
    section: "Sektion 3 · Reaktioner",
    text: "Du ser ett inlägg med en åsikt du inte håller med om. Vad gör du oftast?",
    helper: "Välj upp till två alternativ.",
    type: "checkbox",
    max: 2,
    options: ["Scrollar vidare", "Läser/tittar ändå klart", "Går in i kommentarerna", "Kommenterar själv", "Jag brukar inte möta den typen av innehåll"],
  },
  {
    section: "Sektion 3 · Reaktioner",
    text: "Du ser en video om ett ämne du tycker är intressant. Vad gör du sen?",
    helper: "Välj upp till två alternativ.",
    type: "checkbox",
    max: 2,
    options: ["Jag brukar sedan få upp liknande videos", "Jag fortsätter aktivt titta på liknande videos", "Jag söker upp mer information om ämnet eller läser kommentarer", "Scrollar vidare"],
  },
  {
    section: "Sektion 4 · Reflektion",
    text: "Du märker att ditt innehåll i flödet ofta matchar med dina åsikter. Vad tänker du om det?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Det gör att flödet känns mer personligt", "Jag skulle vilja se mer olika perspektiv ibland", "Det känns ganska normalt, alla har väl sitt flöde", "Jag har aldrig tänkt så mycket på det"],
  },
  {
    section: "Sektion 4 · Reflektion",
    text: "Hur ofta tänker du på att algoritmer påverkar vad du ser, medan du faktiskt scrollar?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Ja, jag tänker ofta på det medan jag scrollar", "Ibland, om jag märker att mycket innehåll liknar det jag redan tycker", "Sällan, jag scrollar oftast utan att reflektera över det", "Nej, det är inget jag tänker på i stunden"],
  },
  {
    section: "Sektion 4 · Reflektion",
    text: "Vad tror du påverkar ditt flöde mest?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Det jag aktivt gillar, kommenterar, sparar eller delar", "Jag stannar kvar vid vissa typer av inlägg längre/kortare", "Vad mina vänner tittar på eller vad vi skickar till varandra", "Jag tror inte det finns en större anledning bakom hur mitt flöde ser ut"],
  },
  {
    section: "Sektion 4 · Reflektion",
    text: "Du märker att ditt flöde ofta visar innehåll som stämmer med dina egna åsikter. Vad tänker du?",
    helper: "Välj ett alternativ.",
    type: "radio",
    options: ["Det känns naturligt och bekvämt", "Jag reflekterar inte så mycket över det", "Det gör mig lite nyfiken på vad jag missar", "Jag försöker aktivt söka upp andra perspektiv"],
  },
  {
    section: "Sektion 4 · Reflektion",
    text: "Har du någon gång aktivt försökt lura algoritmen, t.ex. följt konton du egentligen inte gillar för att få ett bredare flöde?",
    helper: "Sista frågan i testet.",
    type: "radio",
    options: ["Ja, det gör jag ibland", "Jag har testat det någon gång", "Nej, men jag har tänkt på det", "Nej, det har inte fallit mig in"],
  },
];

let currentQuestion = 0;
const answers = {};
let quizCompleted = false;
let hasUploadedData = false;

function showRoute(route) {
  let selectedRoute = routes.includes(route) ? route : "home";
  if (selectedRoute === "results" && !quizCompleted) {
    selectedRoute = "quiz";
  }
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === selectedRoute);
  });
  window.location.hash = selectedRoute;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateResultsAccess() {
  document.querySelectorAll("[data-results-link]").forEach((link) => {
    link.classList.toggle("disabled", !quizCompleted);
    link.setAttribute("aria-disabled", quizCompleted ? "false" : "true");
    if (quizCompleted) {
      link.href = "#results";
      link.dataset.route = "results";
      if (link.textContent.includes("Svara")) link.textContent = "Visa resultat";
    } else {
      link.href = "#quiz";
      link.dataset.route = "quiz";
    }
  });
}

document.querySelectorAll("[data-route]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showRoute(link.dataset.route);
  });
});

window.addEventListener("hashchange", () => showRoute(location.hash.replace("#", "")));

function renderQuestion() {
  const question = questions[currentQuestion];
  document.getElementById("progressBar").style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  document.getElementById("questionSection").textContent = `Fråga ${currentQuestion + 1} av ${questions.length}`;
  document.getElementById("questionText").textContent = question.text;
  document.getElementById("questionHelper").textContent = question.helper;

  const answerList = document.getElementById("answerList");
  answerList.innerHTML = "";

  question.options.forEach((option) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    const input = document.createElement("input");
    input.type = question.type === "rank" ? "checkbox" : question.type;
    input.name = `question-${currentQuestion}`;
    input.value = option;

    const stored = answers[currentQuestion] || [];
    input.checked = stored.includes(option);
    label.classList.toggle("selected", input.checked);

    if (question.type === "rank" && input.checked) {
      const rank = document.createElement("span");
      rank.className = "rank-badge";
      rank.textContent = stored.indexOf(option) + 1;
      label.append(rank);
    }

    input.addEventListener("change", () => {
      if (question.type === "rank") {
        const selected = answers[currentQuestion] || [];
        if (input.checked && !selected.includes(option)) {
          if (selected.length >= question.max) {
            input.checked = false;
            return;
          }
          answers[currentQuestion] = [...selected, option];
        } else {
          answers[currentQuestion] = selected.filter((item) => item !== option);
        }
      } else if (question.type === "checkbox") {
        const checked = [...answerList.querySelectorAll("input:checked")].map((item) => item.value);
        if (checked.length > question.max) {
          input.checked = false;
          return;
        }
        answers[currentQuestion] = checked;
      } else {
        answers[currentQuestion] = [option];
      }
      renderQuestion();
    });

    label.append(input, document.createTextNode(option));
    answerList.append(label);
  });

  document.getElementById("prevQuestion").disabled = currentQuestion === 0;
  document.getElementById("nextQuestion").textContent = currentQuestion === questions.length - 1 ? "Visa resultat" : "Nästa";
  document.getElementById("quizFinalNote")?.classList.toggle("hidden", currentQuestion !== questions.length - 1);
}

document.getElementById("prevQuestion").addEventListener("click", () => {
  currentQuestion = Math.max(0, currentQuestion - 1);
  renderQuestion();
  scrollToQuizTop();
});

document.getElementById("nextQuestion").addEventListener("click", async () => {
  if (!answers[currentQuestion] || answers[currentQuestion].length === 0) return;
  if (questions[currentQuestion].type === "rank" && answers[currentQuestion].length < questions[currentQuestion].max) return;
  if (currentQuestion === questions.length - 1) {
    if (hasUploadedData) {
      await completeQuizAndShowResults();
    } else {
      document.getElementById("uploadPromptModal").classList.remove("hidden");
    }
    return;
  }
  currentQuestion += 1;
  renderQuestion();
  scrollToQuizTop();
});

function scrollToQuizTop() {
  const quizSection = document.getElementById("quiz");
  const topbarOffset = 90;

  window.scrollTo({
    top: Math.max(0, quizSection.offsetTop - topbarOffset),
    behavior: "smooth",
  });
}

async function completeQuizAndShowResults() {
  await updateResultsFromQuiz();
  quizCompleted = true;
  updateResultsAccess();
  showRoute("results");
}

document.getElementById("modalUploadButton").addEventListener("click", () => {
  document.getElementById("uploadPromptModal").classList.add("hidden");
  showRoute("upload");
});

document.getElementById("modalResultButton").addEventListener("click", async () => {
  document.getElementById("uploadPromptModal").classList.add("hidden");
  await completeQuizAndShowResults();
});

async function updateResultsFromQuiz() {
  if (window.QuizScoring) {
    const result = await window.QuizScoring.scoreQuizResult(questions, answers);
    window.latestQuizResult = result;

    const bubbleScore = Math.round(result.scores.echo_chamber_score);
    const polarizationScore = Math.round(result.scores.polarization_risk_score);
    const diversityScore = Math.round(result.scores.content_diversity_score);
    const opposingScore = Math.round(result.features.opposing_content_engagement);

    setGauge(bubbleScore);
    setMetric("polarizationMetric", polarizationScore);
    setMetric("diversityMetric", diversityScore);
    setMetric("opposingMetric", opposingScore);

    renderAdaptiveResult(result);
    return;
  }

  const flatAnswers = Object.values(answers).flat();
  const riskSignals = flatAnswers.filter((answer) =>
    [
      "TikTok",
      "X / Twitter",
      "Korta videos eller reels",
      "Kommentarsfält och diskussioner",
      "Att algoritmen har plockat upp att jag gillar det",
      "Aldrig - jag ser mest innehåll från privatpersoner eller influencers",
      "Ofta",
      "Väldigt olika, jag tror vi lever i olika informationsflöden",
      "Gillar eller kommenterar",
      "Sparar/skickar vidare",
      "Scrollar vidare",
      "Går in i kommentarerna",
      "Kommenterar själv",
      "Jag brukar inte möta den typen av innehåll",
      "Jag brukar sedan få upp liknande videos",
      "Jag fortsätter aktivt titta på liknande videos",
      "Det gör att flödet känns mer personligt",
      "Sällan, jag scrollar oftast utan att reflektera över det",
      "Nej, det är inget jag tänker på i stunden",
      "Det jag aktivt gillar, kommenterar, sparar eller delar",
      "Jag stannar kvar vid vissa typer av inlägg längre/kortare",
      "Det känns naturligt och bekvämt",
      "Jag reflekterar inte så mycket över det",
      "Nej, det har inte fallit mig in",
    ].includes(answer)
  ).length;
  const score = Math.min(92, 36 + riskSignals * 4);
  document.getElementById("scoreValue").textContent = `${score}%`;
  setGauge(score);
  setMetric("polarizationMetric", Math.min(90, score + 3));
  setMetric("diversityMetric", Math.max(18, 92 - score));
  setMetric("opposingMetric", Math.max(16, 84 - score));
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

const SCORE_LEVELS = {
  low: { max: 32, label: "låg" },
  medium: { max: 66, label: "måttlig" },
  high: { max: 100, label: "hög" },
};

const METRIC_INTERPRETATIONS = {
  bubble: {
    direction: "risk",
    labels: { low: "relativt låg", medium: "måttlig", high: "hög" },
  },
  algorithmicInfluence: {
    direction: "risk",
    labels: { low: "relativt låg", medium: "måttlig", high: "hög" },
  },
  oneSidedness: {
    direction: "risk",
    labels: { low: "relativt låg", medium: "måttlig", high: "hög" },
  },
  contentDiversity: {
    direction: "protective",
    labels: { low: "begränsad", medium: "måttlig", high: "bred" },
  },
  opposingContact: {
    direction: "protective",
    labels: { low: "begränsad", medium: "måttlig", high: "tydlig" },
  },
};

const METRIC_ID_TO_KEY = {
  polarizationMetric: "oneSidedness",
  diversityMetric: "contentDiversity",
  opposingMetric: "opposingContact",
};

function getScoreLevel(score) {
  const value = clampPercent(score);
  if (value <= SCORE_LEVELS.low.max) return "low";
  if (value <= SCORE_LEVELS.medium.max) return "medium";
  return "high";
}

function getMetricInterpretation(score, metricKey = "algorithmicInfluence") {
  const level = getScoreLevel(score);
  const config = METRIC_INTERPRETATIONS[metricKey] || METRIC_INTERPRETATIONS.algorithmicInfluence;
  const isProtective = config.direction === "protective";
  const color =
    level === "medium"
      ? "#f28235"
      : level === "high"
        ? isProtective
          ? "#67b875"
          : "#d94343"
        : isProtective
          ? "#d9644f"
          : "#67b875";

  return {
    level,
    label: config.labels[level],
    color,
    direction: config.direction,
  };
}

function getSummaryText(scores, features) {
  const diversity = getMetricInterpretation(scores.content_diversity_score, "contentDiversity").label;
  const oneSidedness = getMetricInterpretation(scores.polarization_risk_score, "oneSidedness").label;
  const opposing = getMetricInterpretation(features.opposing_content_engagement, "opposingContact").label;

  return `Dina svar visar ${oneSidedness} ensidighetsrisk, ${diversity} innehållsbredd och ${opposing} kontakt med andra perspektiv.`;
}

function setMetric(metricId, value) {
  const metric = document.getElementById(metricId).closest(".metric");
  const percent = clampPercent(value);
  const interpretation = getMetricInterpretation(percent, METRIC_ID_TO_KEY[metricId]);
  document.getElementById(metricId).textContent = `${percent}%`;
  metric.dataset.level = interpretation.level;
  metric.style.setProperty("--metric-value", `${percent}%`);
  metric.querySelector("div span").style.width = `${percent}%`;
}

function setGauge(value) {
  const score = clampPercent(value);
  const gauge = document.querySelector(".gauge");
  document.getElementById("scoreValue").textContent = `${score}%`;
  gauge.style.setProperty("--score", score);
  gauge.style.setProperty("--score-angle", `${score * 1.8}deg`);
}

function rangeLabel(score) {
  return getMetricInterpretation(score).label;
}

function normalizeValue(value, min, max) {
  return clampPercent(((value - min) / (max - min)) * 100);
}

function profileLabel(personaLabel, scores) {
  if (personaLabel === "Reflective User") return "Reflekterande utforskare";
  if (personaLabel === "Algorithm-Driven Engager") return "Algoritmförstärkt användare";
  if (personaLabel === "Echo Chamber User") return "Självförstärkande flödesmönster";
  if (personaLabel === "Mixed Exposure User") return "Blandad exponeringsprofil";
  if (scores.content_diversity_score >= 58) return "Blandad exponeringsprofil";
  return "Passiv flödesprofil";
}

function bubbleSummary(scores, features) {
  const echo = scores.echo_chamber_score;
  const diversity = scores.content_diversity_score;
  const influence = scores.algorithmic_influence_score;
  const opposing = features.opposing_content_engagement;
  const echoLevel = getMetricInterpretation(echo, "bubble").level;
  const diversityLevel = getMetricInterpretation(diversity, "contentDiversity").level;
  const opposingLevel = getMetricInterpretation(opposing, "opposingContact").level;

  if (echoLevel === "high" && diversityLevel !== "high" && opposingLevel === "low") {
    return "Dina svar antyder ett mer självförstärkande flöde, där liknande teman kan återkomma samtidigt som kontakten med andra perspektiv verkar begränsad.";
  }
  if (getMetricInterpretation(influence, "algorithmicInfluence").level !== "low" && echoLevel !== "low") {
    return "Dina beteendemönster tyder på att plattformen kan få tydliga signaler om vad du stannar vid, vilket kan förstärka återkommande teman.";
  }
  if (diversityLevel === "high" && opposingLevel !== "low" && echoLevel !== "high") {
    return "Dina svar pekar mot en bredare informationsyta, med flera signaler om att du möter eller undersöker olika perspektiv.";
  }
  if (echoLevel === "low" && getMetricInterpretation(influence, "algorithmicInfluence").level === "low") {
    return "Resultatet antyder ett mindre självförstärkande flöde, där dina svar inte pekar starkt mot upprepade eller låsta mönster.";
  }
  return "Dina svar visar en blandad profil: vissa signaler pekar mot bredd, medan andra kan skapa upprepning eller tydligare rekommendationsmönster.";
}

function meaningInsights(scores, features) {
  const insights = [];
  const influenceLevel = getMetricInterpretation(scores.algorithmic_influence_score, "algorithmicInfluence").level;
  const diversityLevel = getMetricInterpretation(scores.content_diversity_score, "contentDiversity").level;
  const opposingLevel = getMetricInterpretation(features.opposing_content_engagement, "opposingContact").level;

  if (influenceLevel === "high") {
    insights.push("Din interaktion kan ge plattformen starka signaler, vilket kan göra att liknande teman återkommer snabbare.");
  } else if (influenceLevel === "medium") {
    insights.push("Dina svar tyder på vissa rekommendationssignaler, men inte nödvändigtvis ett helt låst mönster.");
  } else {
    insights.push("Dina svar antyder att rekommendationerna inte domineras lika starkt av upprepade engagemangssignaler.");
  }

  if (diversityLevel === "high") {
    insights.push("Innehållsbredden verkar relativt stark, vilket kan innebära att du möter flera ämnen och typer av källor.");
  } else if (diversityLevel === "medium") {
    insights.push("Innehållsbredden ser måttlig ut: det finns viss variation, men några teman eller format kan fortfarande få mycket utrymme.");
  } else {
    insights.push("Innehållsbredden verkar mer begränsad, vilket kan göra det lättare för samma ämnen eller vinklar att dominera flödet.");
  }

  if (opposingLevel === "low") {
    insights.push("Kontakten med avvikande perspektiv ser begränsad ut, vilket kan minska synligheten för hur andra tolkar samma frågor.");
  } else if (opposingLevel === "medium") {
    insights.push("Kontakten med andra perspektiv verkar måttlig: du möter vissa skillnader, men de behöver inte dominera flödet.");
  } else {
    insights.push("Du verkar oftare stanna kvar vid innehåll du inte direkt håller med om, vilket kan bredda jämförelseytan i flödet.");
  }

  if (features.in_moment_algorithm_awareness >= 3) {
    insights.push("Du verkar ha en viss medvetenhet om algoritmer medan du scrollar, vilket kan göra det lättare att upptäcka upprepning.");
  }

  return insights.slice(0, 4);
}

function setBar(container, selector, value) {
  const item = container.querySelector(selector);
  if (!item) return;
  const bar = item.querySelector("i, b, span");
  if (bar) bar.style.width = `${clampPercent(value)}%`;
}

function comparisonValues(scores, features) {
  return {
    diversity: {
      reflection: normalizeValue(features.feed_alignment_reaction + features.echo_chamber_reflection, 2, 10),
      behavior: scores.content_diversity_score,
    },
    opposition: {
      reflection: normalizeValue(features.echo_chamber_reflection + features.algorithm_resistance_behavior, 2, 9),
      behavior: features.opposing_content_engagement,
    },
    repetition: {
      reflection: 100 - normalizeValue(features.repetition_interpretation + features.in_moment_algorithm_awareness, 2, 9),
      behavior: Math.max(scores.echo_chamber_score, features.rabbit_hole_tendency),
    },
  };
}

function comparisonText(scores, features) {
  const values = comparisonValues(scores, features);
  if (values.diversity.reflection - values.diversity.behavior > 25) {
    return "Du signalerar en vilja till bredare exponering, men beteendemönstren antyder att flödet ändå kan återkomma till liknande innehåll.";
  }
  if (values.opposition.reflection - values.opposition.behavior > 25) {
    return "Du verkar reflektera över andra perspektiv, men dina svar om faktisk interaktion antyder mer begränsad kontakt med innehåll du inte håller med om.";
  }
  if (values.repetition.behavior > 65) {
    return "Upprepningssignalerna är tydliga i dina svar, vilket kan förklara varför vissa teman kan kännas vanligare än de egentligen är.";
  }
  if (scores.content_diversity_score >= 60) {
    return "Dina reflektioner och beteendesignaler pekar åt samma håll: flödet verkar ha en relativt bred informationsyta.";
  }
  return "Jämförelsen visar hur dina medvetna reflektioner och dina beteendesignaler kan dra flödet i lite olika riktningar.";
}

function consequenceCards(scores, features) {
  const cards = [];

  if (scores.echo_chamber_score >= 60) {
    cards.push({
      title: "Bekanta perspektiv kan väga tyngre",
      text: "Upprepad exponering för liknande vinklar kan gradvis göra alternativa perspektiv mindre synliga eller mindre rimliga.",
    });
  }
  if (features.opposing_content_engagement <= 20) {
    cards.push({
      title: "Mindre kontakt med avvikande synsätt",
      text: "Begränsad interaktion med innehåll du inte håller med om kan minska känslan för hur annorlunda andra upplever samma fråga.",
    });
  }
  if (scores.algorithmic_influence_score >= 58 || features.rabbit_hole_tendency >= 45) {
    cards.push({
      title: "Snabbare rekommendationsloopar",
      text: "När du stannar vid eller fortsätter på liknande innehåll kan plattformen tolka det som en stark signal att visa mer av samma typ.",
    });
  }
  if (features.in_moment_algorithm_awareness >= 3) {
    cards.push({
      title: "Medvetenhet som motvikt",
      text: "Dina svar tyder på att du ibland märker algoritmens roll medan du scrollar, vilket kan hjälpa dig att upptäcka när flödet blir smalt.",
    });
  }
  if (scores.content_diversity_score >= 58) {
    cards.push({
      title: "Bredd som skyddsfaktor",
      text: "En bredare mix av ämnen och perspektiv kan göra det lättare att jämföra påståenden innan de känns självklara.",
    });
  }
  if (!cards.length) {
    cards.push({
      title: "Blandade signaler",
      text: "Dina svar pekar inte starkt åt ett enda håll, vilket kan betyda att flödet varierar mellan bredare och mer upprepade perioder.",
    });
  }

  return cards.slice(0, 4);
}

function profileDetails(label, scores, features) {
  const strengths = [];
  const blindSpots = [];

  if (scores.content_diversity_score >= 58) strengths.push("Du verkar ha en bredare kontaktyta mot ämnen och format.");
  if (features.in_moment_algorithm_awareness >= 3) strengths.push("Du uppmärksammar ibland hur rekommendationer påverkar vad du ser.");
  if (features.opposing_content_engagement >= 25) strengths.push("Du stannar ibland kvar vid innehåll som inte direkt bekräftar din egen syn.");
  if (features.algorithm_resistance_behavior >= 3) strengths.push("Du har testat att aktivt påverka eller bredda flödet.");

  if (scores.echo_chamber_score >= 58) blindSpots.push("Liknande vinklar kan få mer plats än du märker i stunden.");
  if (features.opposing_content_engagement < 22) blindSpots.push("Motstridiga perspektiv verkar inte få lika mycket aktiv uppmärksamhet.");
  if (features.rabbit_hole_tendency >= 40) blindSpots.push("Intressanta ämnen kan snabbt bli upprepade rekommendationsspår.");
  if (features.in_moment_algorithm_awareness < 3) blindSpots.push("Algoritmens påverkan kan vara lätt att missa medan du scrollar.");

  return {
    description: `${label} beskriver ett mönster i hur dina svar förhåller sig till innehållsbredd, upprepning och rekommendationssignaler. Det är inte en politisk kategori.`,
    strengths: strengths.slice(0, 3),
    blindSpots: blindSpots.slice(0, 3),
  };
}

function renderList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.append(li);
  });
}

function renderAdaptiveResult(result) {
  const { scores, features } = result;
  const label = profileLabel(result.personaLabel, scores);

  document.getElementById("personaLabel").textContent = label;
  document.getElementById("personaExplanation").textContent = profileDetails(label, scores, features).description;
  document.getElementById("bubbleSummary").textContent = bubbleSummary(scores, features);
  document.getElementById("meaningIntro").textContent = getSummaryText(scores, features);

  const insightContainer = document.getElementById("meaningInsights");
  insightContainer.innerHTML = "";
  meaningInsights(scores, features).forEach((text) => {
    const article = document.createElement("article");
    article.textContent = text;
    insightContainer.append(article);
  });

  const comparisonChart = document.getElementById("comparisonChart");
  if (comparisonChart) {
    const comparison = comparisonValues(scores, features);
    document.getElementById("comparisonText").textContent = comparisonText(scores, features);
    comparisonChart.querySelectorAll("[data-comparison]").forEach((row) => {
      const values = comparison[row.dataset.comparison];
      row.querySelector("i").style.width = `${clampPercent(values.reflection)}%`;
      row.querySelector("b").style.width = `${clampPercent(values.behavior)}%`;
    });
  }

  const behaviorValues = [
    scores.content_diversity_score,
    features.opposing_content_engagement,
    Math.max(scores.echo_chamber_score, features.rabbit_hole_tendency),
    features.agreeing_content_engagement,
    normalizeValue(features.in_moment_algorithm_awareness, 1, 4),
    normalizeValue(features.algorithm_resistance_behavior, 1, 4),
  ];
  document.querySelectorAll("#behaviorBars > div").forEach((row, index) => {
    row.querySelector("i").style.width = `${clampPercent(behaviorValues[index])}%`;
  });

  const profile = profileDetails(label, scores, features);
  document.getElementById("profileDescription").textContent = profile.description;
  renderList(document.getElementById("profileStrengths"), profile.strengths.length ? profile.strengths : ["Dina svar visar en blandad profil med flera möjliga tolkningsspår."]);
  renderList(document.getElementById("profileBlindSpots"), profile.blindSpots.length ? profile.blindSpots : ["Inga starka blinda fläckar sticker ut i quizmönstret."]);

  const grid = document.getElementById("consequenceGrid");
  grid.innerHTML = "";
  consequenceCards(scores, features).forEach((card) => {
    const article = document.createElement("article");
    const title = document.createElement("strong");
    const text = document.createElement("p");
    title.textContent = card.title;
    text.textContent = card.text;
    article.append(title, text);
    grid.append(article);
  });
}

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.setAttribute("aria-expanded", trigger.dataset.accordion === "instagram" ? "true" : "false");
  trigger.addEventListener("click", () => {
    document.querySelectorAll(".accordion-panel").forEach((panel) => {
      panel.classList.toggle("open", panel.id === trigger.dataset.accordion && !panel.classList.contains("open"));
    });
    document.querySelectorAll(".accordion-trigger").forEach((item) => {
      const panel = document.getElementById(item.dataset.accordion);
      item.setAttribute("aria-expanded", panel.classList.contains("open") ? "true" : "false");
    });
  });
});

const fileInput = document.getElementById("fileInput");
const fileStatus = document.getElementById("fileStatus");
const dropZone = document.getElementById("dropZone");

function setFile(file) {
  if (!file) return;
  hasUploadedData = true;
  fileStatus.textContent = `${file.name} är vald och redo att analyseras.`;
}

fileInput.addEventListener("change", () => setFile(fileInput.files[0]));

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});

dropZone.addEventListener("drop", (event) => setFile(event.dataTransfer.files[0]));

document.getElementById("downloadButton").addEventListener("click", () => {
  const result = window.latestQuizResult;
  const content = result
    ? [
        "Echo rapport",
        "",
        `Profil: ${document.getElementById("personaLabel").textContent}`,
        `Bubbelindex: ${Math.round(result.scores.echo_chamber_score)}%`,
        `Risk för ensidighet: ${Math.round(result.scores.polarization_risk_score)}%`,
        `Innehållsbredd: ${Math.round(result.scores.content_diversity_score)}%`,
        "",
        document.getElementById("bubbleSummary").textContent,
      ].join("\n")
    : "Echo rapport\n\nGör quizet för att skapa en personlig rapport.";
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bubble-check-rapport.txt";
  link.click();
  URL.revokeObjectURL(url);
});

renderQuestion();
updateResultsAccess();
showRoute(location.hash.replace("#", "") || "home");
