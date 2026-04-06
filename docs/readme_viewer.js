document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("readme-content");
  if (!container) return;

  try {
    const response = await fetch("../README.rst", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load README.rst: ${response.status} ${response.statusText}`);
    }

    const rst = await response.text();
    container.innerHTML = rstToHtml(rst);
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${escapeHtml(err.message)}</p>`;
  }
});

function rstToHtml(rst) {
  const lines = rst.replace(/\r\n/g, "\n").split("\n");
  const targets = extractTargets(lines);

  const html = [];
  let i = 0;
  let inList = false;
  let inCode = false;
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    html.push(`<p>${formatInline(paragraph.join(" "), targets)}</p>`);
    paragraph = [];
  }

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  function closeCode() {
    if (inCode) {
      html.push("</code></pre>");
      inCode = false;
    }
  }

  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1] || "";
    const prev = lines[i - 1] || "";

    if (inCode) {
      if (line.startsWith("  ") || line.startsWith("\t") || line.trim() === "") {
        html.push(`${escapeHtml(line.replace(/^(  |\t)/, ""))}\n`);
        i++;
        continue;
      } else {
        closeCode();
      }
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      i++;
      continue;
    }

    // Skip directives / targets / comments
    if (line.startsWith(".. ")) {
      flushParagraph();
      closeList();
      i++;
      continue;
    }

    // Skip pure adornment lines everywhere
    if (isPureAdornment(line, "#") || isPureAdornment(line, "*")) {
      flushParagraph();
      closeList();
      i++;
      continue;
    }

    // Overline + title + underline headers
    if (isAdornmentLine(prev, "#", line) && isAdornmentLine(next, "#", line)) {
      flushParagraph();
      closeList();
      html.push(`<h1>${formatInline(line.trim(), targets)}</h1>`);
      i += 2;
      continue;
    }

    if (isAdornmentLine(prev, "*", line) && isAdornmentLine(next, "*", line)) {
      flushParagraph();
      closeList();
      html.push(`<h2>${formatInline(line.trim(), targets)}</h2>`);
      i += 2;
      continue;
    }

    if (next && isUnderline(next, "=")) {
      flushParagraph();
      closeList();
      html.push(`<h1>${formatInline(line.trim(), targets)}</h1>`);
      i += 2;
      continue;
    }

    if (next && isUnderline(next, "-")) {
      flushParagraph();
      closeList();
      html.push(`<h2>${formatInline(line.trim(), targets)}</h2>`);
      i += 2;
      continue;
    }

    if (next && isUnderline(next, "~")) {
      flushParagraph();
      closeList();
      html.push(`<h3>${formatInline(line.trim(), targets)}</h3>`);
      i += 2;
      continue;
    }

    if (line.trim().endsWith("::")) {
      flushParagraph();
      closeList();
      html.push("<pre><code>");
      inCode = true;
      i++;
      continue;
    }

    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInline(bullet[1], targets)}</li>`);
      i++;
      continue;
    }

    closeList();
    paragraph.push(line.trim());
    i++;
  }

  flushParagraph();
  closeList();
  closeCode();

  return html.join("\n");
}

function extractTargets(lines) {
  const targets = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Matches:
    // .. _name: url
    // .. _`name with spaces`: url
    const m = line.match(/^\.\.\s+_(`?)([^:]+?)\1:\s*(\S+)\s*$/);
    if (m) {
      const name = m[2].trim();
      const url = m[3].trim();
      targets[name] = url;
    }
  }

  return targets;
}

function isUnderline(line, ch) {
  const trimmed = line.trim();
  return trimmed.length >= 3 && [...trimmed].every(c => c === ch);
}

function isPureAdornment(line, ch) {
  const trimmed = line.trim();
  return trimmed.length > 0 && [...trimmed].every(c => c === ch);
}

function isAdornmentLine(adornmentLine, ch, textLine) {
  const a = adornmentLine.trim();
  const t = textLine.trim();
  return a.length === t.length && a.length > 0 && [...a].every(c => c === ch);
}

function formatHref(url) {
  const trimmed = url.trim();

  // Detect plain email (no mailto:)
  if (isEmail(trimmed) && !trimmed.startsWith("mailto:")) {
    return "mailto:" + trimmed;
  }

  return escapeHtmlAttr(trimmed);
}

function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function formatInline(text, targets = {}) {
  let s = escapeHtml(text);

  // Inline explicit link: `label <url>`_
  s = s.replace(/`([^`]+) &lt;([^&]+)&gt;`_/g, (match, label, url) => {
    return `<a href="${formatHref(url)}">${escapeHtml(label)}</a>`;
  });

  // Target references: `target_name`_
  s = s.replace(/`([^`]+)`_/g, (match, label) => {
    const normalizedLabel = label.trim();
    const url = targets[normalizedLabel];

    if (url) {
      return `<a href="${formatHref(url)}">${escapeHtml(normalizedLabel)}</a>`;
    }

    return escapeHtml(normalizedLabel);
  });

  // Inline code
  s = s.replace(/``([^`]+)``/g, "<code>$1</code>");

  // Bold / italic
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

function escapeHtmlAttr(s) {
  return escapeHtml(s);
}