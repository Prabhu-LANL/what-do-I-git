window.addEventListener("DOMContentLoaded", async () => {
  await loadSlidesFromMarkdownUrl("https://raw.githubusercontent.com/Prabhu-LANL/what-do-I-git/refs/heads/main/quiz.md", {
    containerId: "sourceSlides"
  });

  const sourceSlides = Array.from(document.querySelectorAll("#sourceSlides .source-slide"));
  const page = document.getElementById("allSlidesPage");

  function splitBodyAndNotes(sourceSlide) {
    const clone = sourceSlide.cloneNode(true);

    // Extract notes
    const notes = clone.querySelector(".notes");
    let notesHtml = "";
    if (notes) {
      notesHtml = notes.innerHTML.trim();
      notes.remove();
    }

    // Remove first heading (title)
    const firstHeading = clone.querySelector("h1, h2, h3, h4, h5, h6");
    if (firstHeading) {
      firstHeading.remove();
    }

    return {
      bodyHtml: clone.innerHTML.trim(),
      notesHtml
    };
  }

  function makeSlideCard(sourceSlide, index) {
    const { bodyHtml, notesHtml } = splitBodyAndNotes(sourceSlide);
    const title = sourceSlide.dataset.title || `Slide ${index + 1}`;
    const hasNotes = !!notesHtml;

    const card = document.createElement("section");
    card.className = "slide-card";

    const header = document.createElement("div");
    header.className = "slide-card-header";

    const titleEl = document.createElement("div");
    titleEl.className = "slide-card-title";
    titleEl.textContent = `${index + 1}. ${title}`;

    header.appendChild(titleEl);

    let toggle = null;

    if (hasNotes) {
      toggle = document.createElement("button");
      toggle.className = "notes-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");

      toggle.innerHTML = `
        <span>Show answer</span>
        <svg viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      `;

      header.appendChild(toggle);
    }

    const body = document.createElement("div");
    body.className = "slide-card-body";

    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = bodyHtml;

    const notesBox = document.createElement("div");
    notesBox.className = "slide-notes";

    if (hasNotes) {
      notesBox.innerHTML = notesHtml;
    } else {
      notesBox.innerHTML = `<p class="slide-notes-empty">No notes for this slide.</p>`;
    }

    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        toggle.querySelector("span").textContent = open ? "Show answer" : "Hide answer";
        notesBox.classList.toggle("show", !open);
      });
    }

    body.appendChild(slide);
    body.appendChild(notesBox);

    card.appendChild(header);
    card.appendChild(body);

    return card;
  }

  if (sourceSlides.length === 0) {
    const empty = document.createElement("div");
    empty.className = "slide-card";
    empty.innerHTML = `
      <div class="slide-card-header">
        <div class="slide-card-title">No slides found</div>
      </div>
      <div class="slide-card-body">
        <div class="slide">
          <p>Could not load <code>quiz.md</code>.</p>
        </div>
      </div>
    `;
    page.appendChild(empty);
    return;
  }

  sourceSlides.forEach((slide, i) => {
    page.appendChild(makeSlideCard(slide, i));
  });
});