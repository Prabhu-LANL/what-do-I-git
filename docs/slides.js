window.addEventListener("DOMContentLoaded", async () => {
  const markdownFile = document.body.dataset.markdown || "slides.md";

  await loadSlidesFromMarkdownUrl(markdownFile, {
    containerId: "sourceSlides"
  });

  const sources = Array.from(
    document.querySelectorAll("#sourceSlides .source-slide")
  );

  const viewport = document.getElementById("slideViewport");
  const notesViewport = document.getElementById("notesViewport");
  const notesPanel = document.getElementById("notesPanel");
  const progressText = document.getElementById("progressText");
  const deckTitle = document.getElementById("deckTitle");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const toggleNotesBtn = document.getElementById("toggleNotesBtn");

  let idx = 0;
  let notesVisible = false;
  let isAnimating = false;

  function updateControls() {
    const total = sources.length;
    progressText.textContent = `${idx + 1} / ${total}`;
    deckTitle.textContent =
      sources[idx]?.dataset?.title || `Slide ${idx + 1}`;

    const atStart = idx === 0;
    const atEnd = idx === total - 1;

    prevBtn.disabled = atStart;
    arrowLeft.disabled = atStart;
    nextBtn.disabled = atEnd;
    arrowRight.disabled = atEnd;
  }

  function getSlideContent(index) {
    const src = sources[index];
    if (!src) {
      return {
        body: "<h2>No slides found</h2>",
        notes: ""
      };
    }

    const clone = src.cloneNode(true);
    const notes = clone.querySelector(".notes");
    let notesHtml = "";

    if (notes) {
      notesHtml = notes.innerHTML.trim();
      notes.remove();
    }

    return {
      body: clone.innerHTML,
      notes: notesHtml
    };
  }

  function renderNotes(html) {
    if (!notesViewport) return;

    if (html && html.trim()) {
      notesViewport.innerHTML = html;
    } else {
      notesViewport.innerHTML = `<p class="notes-empty">No notes for this slide.</p>`;
    }
  }

  function setNotesVisible(visible) {
    if (!notesPanel || !toggleNotesBtn) return;

    notesVisible = visible;
    notesPanel.classList.toggle("show-notes", visible);
    toggleNotesBtn.classList.toggle("btn-active", visible);
    toggleNotesBtn.setAttribute("aria-pressed", String(visible));
  }

  function renderSlide(newIdx, direction = "right") {
    if (isAnimating || sources.length === 0) return;

    const bounded = Math.max(0, Math.min(newIdx, sources.length - 1));
    if (bounded === idx && viewport.innerHTML) return;

    isAnimating = true;

    const exitClass = direction === "left" ? "slide-exit-right" : "slide-exit-left";
    const enterClass = direction === "left" ? "slide-enter-left" : "slide-enter-right";

    viewport.classList.remove(
      "slide-enter",
      "slide-enter-left",
      "slide-enter-right",
      "slide-exit-left",
      "slide-exit-right"
    );
    viewport.classList.add(exitClass);

    window.setTimeout(() => {
      idx = bounded;
      const { body, notes } = getSlideContent(idx);

      viewport.innerHTML = body;
      renderNotes(notes);
      updateControls();

      viewport.classList.remove(exitClass);
      viewport.classList.add(enterClass);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          viewport.classList.remove(enterClass);
          viewport.classList.add("slide-enter");
        });
      });

      window.setTimeout(() => {
        isAnimating = false;
      }, 220);
    }, 180);
  }

  function next() {
    if (idx < sources.length - 1) renderSlide(idx + 1, "right");
  }

  function prev() {
    if (idx > 0) renderSlide(idx - 1, "left");
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (fullscreenBtn) fullscreenBtn.classList.add("btn-active");
      } else {
        await document.exitFullscreen();
        if (fullscreenBtn) fullscreenBtn.classList.remove("btn-active");
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }

  function updateFullscreenButton() {
    if (!fullscreenBtn) return;
    const active = !!document.fullscreenElement;
    fullscreenBtn.classList.toggle("btn-active", active);
    fullscreenBtn.setAttribute("aria-pressed", String(active));
  }

  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (arrowLeft) arrowLeft.addEventListener("click", prev);
  if (arrowRight) arrowRight.addEventListener("click", next);
  if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);
  if (toggleNotesBtn) {
    toggleNotesBtn.addEventListener("click", () => setNotesVisible(!notesVisible));
  }

  document.addEventListener("fullscreenchange", updateFullscreenButton);

  window.addEventListener("keydown", (e) => {
    if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      next();
    }

    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    }

    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    }

    if (e.key === "n" || e.key === "N") {
      if (notesPanel && toggleNotesBtn) {
        e.preventDefault();
        setNotesVisible(!notesVisible);
      }
    }

    if (e.key === "Escape" && notesVisible) {
      setNotesVisible(false);
    }
  });

  if (sources.length > 0) {
    const { body, notes } = getSlideContent(0);
    viewport.innerHTML = body;
    renderNotes(notes);
    updateControls();
  } else {
    viewport.innerHTML = `<h2>No slides found</h2><p>Could not load <code>${markdownFile}</code>.</p>`;
    if (notesViewport) {
      notesViewport.innerHTML = `<p class="notes-empty">No notes for this slide.</p>`;
    }
    updateControls();
  }
});