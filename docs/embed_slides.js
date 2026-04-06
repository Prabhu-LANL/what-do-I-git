/**
 * embed_slides.js
 *
 * Features:
 * - Parses YAML front matter title slide:
 *     ---
 *     title: "Main title"
 *     subtitle: "text\nsecond line"
 *     author: "Name"
 *     date: today
 *     ---
 * - Replaces date: today with actual current date
 * - Supports literal "\n" in YAML values
 * - Splits slides on:
 *    1) lines containing only `---`
 *    2) top-level headings like `# Title {layout="Two Content"}`
 * - Extracts layout metadata from heading attributes
 * - Removes layout attributes from displayed title text
 * - Removes inline attribute blocks like {width=100%}
 * - Ignores HTML comments like <!-- slide 2 -->
 * - Supports Pandoc notes blocks: ::: notes ... :::
 * - Supports Pandoc columns blocks
 * - Parses Markdown tables into HTML tables
 * - Removes "docs/" or "/docs/" from image paths
 * - Removes trailing "\" line-break markers
 * - Uses marked if available, otherwise uses a fallback parser
 */

async function loadSlidesFromMarkdownUrl(mdUrl, options = {}) {
  const {
    containerId = "sourceSlides",
    slideClass = "source-slide",
    hiddenContainerClass = "source-slides",
    setDataTitleFromHeading = true
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Missing container element #${containerId}.`);
  }

  container.classList.add(hiddenContainerClass);

  const res = await fetch(mdUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${mdUrl}: ${res.status} ${res.statusText}`);
  }

  const md = await res.text();

  const { titleSlide, markdownBody } = extractYamlTitleSlide(md);
  const cleanedBody = stripHtmlComments(markdownBody);
  const slides = splitSlides(cleanedBody);

  container.innerHTML = "";

  let slideIndex = 0;

  if (titleSlide) {
    const titleDiv = document.createElement("div");
    titleDiv.className = slideClass;
    titleDiv.dataset.index = String(slideIndex++);
    titleDiv.dataset.title = titleSlide.title || "Title Slide";
    titleDiv.dataset.layout = "Title Slide";
    titleDiv.innerHTML = renderTitleSlideHtml(titleSlide);
    container.appendChild(titleDiv);
  }

  slides.forEach((slideMd, i) => {
    const { bodyMd, notesMd } = extractNotesBlock(slideMd);
    const { cleanedBodyMd, title, layout } = extractSlideMetadata(bodyMd);

    const slideDiv = document.createElement("div");
    slideDiv.className = slideClass;
    slideDiv.dataset.index = String(slideIndex++);

    if (title) slideDiv.dataset.title = title;
    else if (setDataTitleFromHeading) slideDiv.dataset.title = `Slide ${i + 1}`;

    if (layout) slideDiv.dataset.layout = layout;

    slideDiv.innerHTML = markdownToHtmlWithColumns(cleanedBodyMd);

    if (notesMd.trim()) {
      const notesDiv = document.createElement("div");
      notesDiv.className = "notes";
      notesDiv.style.display = "none";
      notesDiv.innerHTML = markdownToHtmlWithColumns(notesMd);
      slideDiv.appendChild(notesDiv);
    }

    container.appendChild(slideDiv);
  });

  return { slideCount: slideIndex };
}

/* =========================
   YAML TITLE SLIDE SUPPORT
   ========================= */

function extractYamlTitleSlide(md) {
  const normalized = md.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  let i = 0;

  // Remove BOM if present
  if (lines[0] && lines[0].charCodeAt(0) === 0xfeff) {
    lines[0] = lines[0].slice(1);
  }

  // Skip leading blank lines
  while (i < lines.length && lines[i].trim() === "") {
    i++;
  }

  // Must begin with YAML front matter delimiter
  if (i >= lines.length || lines[i].trim() !== "---") {
    return { titleSlide: null, markdownBody: normalized };
  }

  i++; // move past opening ---

  const yamlLines = [];
  while (i < lines.length && lines[i].trim() !== "---") {
    yamlLines.push(lines[i]);
    i++;
  }

  // No closing ---
  if (i >= lines.length) {
    return { titleSlide: null, markdownBody: normalized };
  }

  i++; // move past closing ---

  let rest = lines.slice(i).join("\n");

  // Remove leading blank lines
  rest = rest.replace(/^\s+/, "");

  // Remove one or more leading slide separators left after title front matter
  rest = rest.replace(/^(---\s*\n)+/, "");

  const yamlText = yamlLines.join("\n");
  const meta = parseSimpleYaml(yamlText);

  // If it doesn't look like title-slide metadata, leave file alone
  if (!meta.title && !meta.subtitle && !meta.author && !meta.date) {
    return { titleSlide: null, markdownBody: normalized };
  }

  if (typeof meta.date === "string" && meta.date.trim().toLowerCase() === "today") {
    meta.date = formatToday();
  }

  return {
    titleSlide: {
      title: meta.title || "",
      subtitle: meta.subtitle || "",
      author: meta.author || "",
      date: meta.date || ""
    },
    markdownBody: rest.trim()
  };
}

function parseSimpleYaml(yamlText) {
  const obj = {};
  const lines = yamlText.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;

    const key = m[1];
    let value = m[2].trim();

    // Strip matching quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Convert literal "\n" into actual newline characters
    if (typeof value === "string") {
      value = value.replace(/\\n/g, "\n");
    }

    obj[key] = value;
  }

  return obj;
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function renderTitleSlideHtml(meta) {
  const parts = [];

  parts.push(`<div class="md-title-slide">`);

  if (meta.title) {
    parts.push(
      `<h1 class="md-title-slide-title">${escapeHtml(meta.title)}</h1>`
    );
  }

  if (meta.subtitle) {
    parts.push(
      `<p class="md-title-slide-subtitle">${escapeHtml(meta.subtitle).replace(/\n/g, "<br>")}</p>`
    );
  }

  if (meta.author || meta.date) {
    parts.push(`<div class="md-title-slide-meta">`);

    if (meta.author) {
      parts.push(
        `<div class="md-title-slide-author">${escapeHtml(meta.author)}</div>`
      );
    }

    if (meta.date) {
      parts.push(
        `<div class="md-title-slide-date">${escapeHtml(meta.date)}</div>`
      );
    }

    parts.push(`</div>`);
  }

  parts.push(`</div>`);
  return parts.join("\n");
}

/* =========================
   SLIDE SPLITTING
   ========================= */

function splitSlides(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const slides = [];
  let current = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const isHrBreak = /^\s*---\s*$/.test(line);
    const isTopHeading = /^#\s+/.test(line);

    if (isHrBreak) {
      if (hasMeaningfulSlideContent(current)) {
        slides.push(current.join("\n").trim());
      }
      current = [];
      continue;
    }

    if (isTopHeading && hasMeaningfulSlideContent(current)) {
      slides.push(current.join("\n").trim());
      current = [line];
      continue;
    }

    current.push(line);
  }

  if (hasMeaningfulSlideContent(current)) {
    slides.push(current.join("\n").trim());
  }

  return slides;
}

function hasMeaningfulSlideContent(lines) {
  const text = lines.join("\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  return text.length > 0;
}

function stripHtmlComments(md) {
  return md.replace(/<!--[\s\S]*?-->/g, "");
}

/* =========================
   NOTES
   ========================= */

function extractNotesBlock(slideMd) {
  const re = /(^|\n)[ \t]*:::[ \t]*notes[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*(?=\n|$)/m;
  const m = slideMd.match(re);

  if (!m) return { bodyMd: slideMd, notesMd: "" };

  const notesMd = m[2] || "";
  const bodyMd = slideMd.replace(re, "\n").trim();
  return { bodyMd, notesMd };
}

/* =========================
   METADATA FROM HEADING
   ========================= */

function extractSlideMetadata(slideMd) {
  const lines = slideMd.replace(/\r\n/g, "\n").split("\n");

  let title = "";
  let layout = "";

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^#\s+(.+?)\s*(\{.*\})?\s*$/);
    if (!m) continue;

    const headingText = m[1].trim();
    const attrText = m[2] || "";

    const layoutMatch = attrText.match(/layout\s*=\s*"([^"]+)"/);
    if (layoutMatch) {
      layout = layoutMatch[1];
    }

    title = headingText;
    lines[i] = `# ${headingText}`;
    break;
  }

  const cleaned = stripPandocAttributes(lines.join("\n").trim());

  return {
    cleanedBodyMd: cleaned,
    title,
    layout
  };
}

/* =========================
   COLUMNS
   ========================= */

function markdownToHtmlWithColumns(md) {
  const cleaned = stripBackslashLineBreaks(md);
  return parseColumns(cleaned);
}

function parseColumns(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  const output = [];

  while (i < lines.length) {
    if (/^\s*::::\s+columns\s*$/.test(lines[i])) {
      const { html, nextIndex } = parseColumnsBlock(lines, i);
      output.push(html);
      i = nextIndex;
      continue;
    }

    const block = [];
    while (
      i < lines.length &&
      !/^\s*::::\s+columns\s*$/.test(lines[i])
    ) {
      block.push(lines[i]);
      i++;
    }

    output.push(markdownToBasicHtml(block.join("\n")));
  }

  return output.filter(Boolean).join("\n");
}

function parseColumnsBlock(lines, startIndex) {
  let i = startIndex + 1;
  const columns = [];
  let currentColumn = null;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*::::\s*$/.test(line)) {
      if (currentColumn !== null) {
        columns.push(currentColumn.join("\n").trim());
      }
      i++;
      break;
    }

    if (/^\s*:::\s+column\s*$/.test(line)) {
      if (currentColumn !== null) {
        columns.push(currentColumn.join("\n").trim());
      }
      currentColumn = [];
      i++;
      continue;
    }

    if (/^\s*:::\s*$/.test(line)) {
      if (currentColumn !== null) {
        columns.push(currentColumn.join("\n").trim());
        currentColumn = null;
      }
      i++;
      continue;
    }

    if (currentColumn !== null) {
      currentColumn.push(line);
    }

    i++;
  }

  const colsHtml = columns
    .map(colMd => `<div class="md-column">${markdownToBasicHtml(colMd)}</div>`)
    .join("");

  return {
    html: `<div class="md-columns">${colsHtml}</div>`,
    nextIndex: i
  };
}

/* =========================
   MARKDOWN PARSING
   ========================= */

function markdownToBasicHtml(md) {
  const cleaned = stripBackslashLineBreaks(
    stripPandocAttributes(md).trim()
  );

  if (!cleaned) return "";

  if (typeof window !== "undefined" && window.marked && typeof window.marked.parse === "function") {
    const html = window.marked.parse(cleaned, { gfm: true, breaks: true });
    return normalizeImagePathsInHtml(html);
  }

  return simpleMarkdownFallback(cleaned);
}

function stripBackslashLineBreaks(md) {
  return md.replace(/\\\s*\n/g, "\n");
}

function stripPandocAttributes(md) {
  return md
    .replace(/(\!\[[^\]]*\]\([^)]+\))\{[^}\n]*\}/g, "$1")
    .replace(/(\[[^\]]*\]\([^)]+\))\{[^}\n]*\}/g, "$1")
    .replace(/^(\s*#{1,6}\s+.*?)(\s*\{[^}\n]*\})\s*$/gm, "$1")
    .replace(/^(\s*[*-]\s+.*?)(\s*\{[^}\n]*\})\s*$/gm, "$1")
    .replace(/^(\s*[^{}\n]+?)(\s*\{[^}\n]*\})\s*$/gm, (match, a) => a);
}

/* =========================
   FALLBACK PARSER
   ========================= */

function simpleMarkdownFallback(md) {
  const lines = md.split("\n");
  const html = [];
  let inList = false;
  let paragraph = [];
  let i = 0;

  function flushParagraph() {
    if (!paragraph.length) return;
    const content = paragraph.map(escapeInlineMarkdown).join("<br>");
    html.push(`<p>${content}</p>`);
    paragraph = [];
  }

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      closeList();
      i++;
      continue;
    }

    if (isMarkdownTableStart(lines, i)) {
      flushParagraph();
      closeList();
      const { html: tableHtml, nextIndex } = parseMarkdownTable(lines, i);
      html.push(tableHtml);
      i = nextIndex;
      continue;
    }

    let m;

    if ((m = line.match(/^###\s+(.+)$/))) {
      flushParagraph();
      closeList();
      html.push(`<h3>${escapeInlineMarkdown(m[1])}</h3>`);
      i++;
      continue;
    }

    if ((m = line.match(/^##\s+(.+)$/))) {
      flushParagraph();
      closeList();
      html.push(`<h2>${escapeInlineMarkdown(m[1])}</h2>`);
      i++;
      continue;
    }

    if ((m = line.match(/^#\s+(.+)$/))) {
      flushParagraph();
      closeList();
      html.push(`<h1>${escapeInlineMarkdown(m[1])}</h1>`);
      i++;
      continue;
    }

    if ((m = line.match(/^[-*]\s+(.+)$/))) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeInlineMarkdown(m[1])}</li>`);
      i++;
      continue;
    }

    closeList();
    paragraph.push(line);
    i++;
  }

  flushParagraph();
  closeList();

  return html.join("\n");
}

/* =========================
   TABLES
   ========================= */

function isMarkdownTableStart(lines, index) {
  if (index + 1 >= lines.length) return false;

  const header = lines[index].trim();
  const separator = lines[index + 1].trim();

  if (!header.includes("|")) return false;
  if (!/^\|?[\s:\-|\t]+\|?\s*$/.test(separator)) return false;
  if (!separator.includes("-")) return false;

  return true;
}

function parseMarkdownTable(lines, startIndex) {
  const tableLines = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) break;
    if (!line.includes("|")) break;
    tableLines.push(line);
    i++;
  }

  const headerCells = splitMarkdownTableRow(tableLines[0]);
  const bodyLines = tableLines.slice(2);

  let html = `<table class="md-table"><thead><tr>`;
  html += headerCells.map(cell => `<th>${escapeInlineMarkdown(cell)}</th>`).join("");
  html += `</tr></thead><tbody>`;

  for (const rowLine of bodyLines) {
    const cells = splitMarkdownTableRow(rowLine);
    html += `<tr>`;
    html += cells.map(cell => `<td>${escapeInlineMarkdown(cell)}</td>`).join("");
    html += `</tr>`;
  }

  html += `</tbody></table>`;
  return { html, nextIndex: i };
}

function splitMarkdownTableRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map(cell => cell.trim());
}

/* =========================
   IMAGE PATH NORMALIZATION
   ========================= */

function normalizeImageSrc(src) {
  return src.replace(/^\/?docs\//, "");
}

function normalizeImagePathsInHtml(html) {
  return html.replace(/(<img\b[^>]*\bsrc=")\/?docs\/([^"]*)(")/g, (match, a, path, b) => {
    return `${a}${path}${b}`;
  });
}

/* =========================
   INLINE FORMATTING
   ========================= */

function escapeInlineMarkdown(text) {
  let s = escapeHtml(text);

  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    return `<img alt="${alt}" src="${normalizeImageSrc(src)}">`;
  });

  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return s;
}

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
