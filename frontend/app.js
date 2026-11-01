(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const budget = 80,
    threshold = 7;
  const cases = {
    strong: {
      seed: 873,
      probability: 0.72,
      note: "A clear signal can reach the threshold with fewer comparisons.",
    },
    weak: {
      seed: 752,
      probability: 0.57,
      note: "Weaker evidence fluctuates. This path needs more comparisons to reach the threshold.",
    },
    null: {
      seed: 421,
      probability: 0.5,
      note: "Chance alone can cross this toy threshold. This illustration has no false-positive guarantee.",
    },
  };
  let scenario = "weak",
    values = [],
    current = 0,
    timer = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function makeValues() {
    let seed = cases[scenario].seed,
      value = 0;
    values = [0];
    for (let i = 0; i < budget; i++) {
      seed = (1664525 * seed + 1013904223) >>> 0;
      value += seed / 4294967296 < cases[scenario].probability ? 1 : -1;
      values.push(value);
      if (value >= threshold) break;
    }
    $("scrub").max = values.length - 1;
    $("scenario-note").textContent = cases[scenario].note;
  }
  function render() {
    const points = values
      .slice(0, current + 1)
      .map((v, i) => [34 + (i * 532) / budget, 125 - v * 10]);
    $("trace").setAttribute("points", points.map((p) => p.join(",")).join(" "));
    const [x, y] = points.at(-1);
    $("area").setAttribute(
      "d",
      `M34 125 L${points.map((p) => p.join(" ")).join(" L")} L${x} 125 Z`,
    );
    $("cursor").setAttribute("cx", x);
    $("cursor").setAttribute("cy", y);
    $("counter").textContent = current;
    $("scrub").value = current;
    $("scrub").setAttribute(
      "aria-valuetext",
      `${current} comparisons; illustrative score ${values[current]}`,
    );
    $("position").textContent = `${current} of ${values.length - 1}`;
    const finished = current === values.length - 1;
    $("step").disabled = finished;
    $("status").textContent =
      current === 0
        ? "Ready to explore"
        : finished
          ? values[current] >= threshold
            ? "Illustrative threshold reached"
            : "Comparison budget reached"
          : timer
            ? "Comparing…"
            : "Paused for inspection";
    $("play").innerHTML = timer
      ? 'Pause simulation <span aria-hidden="true">Ⅱ</span>'
      : finished
        ? 'Replay simulation <span aria-hidden="true">↺</span>'
        : 'Run simulation <span aria-hidden="true">▶</span>';
    $("chart-description").textContent =
      `${current} of ${budget} possible comparisons. Illustrative score ${values[current]}. ${$("status").textContent}. This is not a p-value or experimental data.`;
  }
  function pause() {
    clearInterval(timer);
    timer = null;
  }
  function step() {
    if (current < values.length - 1) current++;
    if (current === values.length - 1) pause();
    render();
  }
  document.querySelectorAll("[data-case]").forEach((button) =>
    button.addEventListener("click", () => {
      pause();
      scenario = button.dataset.case;
      current = 0;
      makeValues();
      render();
      document
        .querySelectorAll("[data-case]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    }),
  );
  $("step").addEventListener("click", () => {
    pause();
    step();
  });
  $("reset").addEventListener("click", () => {
    pause();
    current = 0;
    render();
  });
  $("scrub").addEventListener("input", (e) => {
    pause();
    current = Number(e.target.value);
    render();
  });
  $("play").addEventListener("click", () => {
    if (timer) {
      pause();
      render();
      return;
    }
    if (current === values.length - 1) current = 0;
    if (reducedMotion.matches) {
      current = values.length - 1;
      render();
      return;
    }
    timer = setInterval(step, 240);
    render();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer) {
      pause();
      render();
    }
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && timer) {
      pause();
      render();
    }
  });

  const figures = {
    detection: {
      file: "power and null rejection.png",
      title: "Power & false positives",
      alt: "Original research figure comparing detection power and null rejection rate across permutation budgets.",
      caption:
        "Report setup: OPT-1.3B, 200 texts, 80 generated tokens, α = 0.05 and c = 0.04. Original project figure; not a new reproduction.",
      guide:
        "Read power and null rejection together. More detections are useful only if false positives stay controlled.",
    },
    cost: {
      file: "decision permutations.png",
      title: "Comparisons to a decision",
      alt: "Original research figure showing median resample counts for watermarked and null examples with fixed and sequential tests.",
      caption:
        "The original report compares median resample counts for watermarked and null examples. Fewer comparisons do not directly establish a wall-clock speedup.",
      guide:
        "Compare the watermarked and null cases separately. Stopping early for futility is different from stopping with evidence for a watermark.",
    },
  };
  let selectedResult = "detection";
  $("figure-image").addEventListener("load", () => {
    $("figure-image").hidden = false;
    $("image-status").hidden = true;
    $("image-stage").setAttribute("aria-busy", "false");
  });
  $("figure-image").addEventListener("error", () => {
    $("figure-image").hidden = true;
    $("image-status").hidden = false;
    $("image-status").textContent =
      "The figure could not load. Try another view or open the original using the full-size link.";
    $("image-stage").setAttribute("aria-busy", "false");
  });
  function showFigure() {
    const robust = selectedResult === "robustness";
    $("robustness-controls").hidden = !robust;
    let figure = figures[selectedResult];
    if (robust) {
      const metric = $("metric").value,
        byAttack = $("grouping").value === "attack";
      const label = $("metric").selectedOptions[0].textContent;
      const grouping = byAttack ? "attack type" : "watermark method";
      figure = {
        file: byAttack
          ? `combined_${metric}_vs_rate.png`
          : `avg_${metric}_by_method.png`,
        title: `${label} by ${grouping}`,
        alt: `Historical research figure: ${label.toLowerCase()} by ${grouping} under text perturbations.`,
        caption:
          "Original project figure of token deletion, insertion, and substitution experiments. Reported settings and aggregation details are in the final report. Raw per-trial data are not included.",
        guide:
          "Text edits can weaken the watermark. Compare detection power alongside false positives and the comparisons required as corruption increases.",
      };
    }
    const src = `assets/${encodeURIComponent(figure.file)}`;
    if ($("figure-image").getAttribute("src") !== src) {
      $("figure-image").hidden = true;
      $("image-status").textContent = "Loading figure…";
      $("image-status").hidden = false;
      $("image-stage").setAttribute("aria-busy", "true");
      $("figure-image").src = src;
    }
    $("figure-image").alt = figure.alt;
    $("figure-link").href = src;
    $("figure-title").textContent = figure.title;
    $("figure-caption").textContent = figure.caption;
    $("reading-guide").textContent = figure.guide;
  }
  document.querySelectorAll("[data-result]").forEach((button) =>
    button.addEventListener("click", () => {
      selectedResult = button.dataset.result;
      document
        .querySelectorAll("[data-result]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      showFigure();
    }),
  );
  $("metric").addEventListener("change", showFigure);
  $("grouping").addEventListener("change", showFigure);
  makeValues();
  // A paused, partial trace makes the chart understandable before the first click.
  current = 32;
  render();
})();
