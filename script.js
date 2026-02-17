document.addEventListener("DOMContentLoaded", () => {
  const toTopBtn = document.getElementById("toTopBtn");
  const quickSidebar = document.querySelector(".quick-sidebar");

  const updateFloatingUi = () => {
    if (toTopBtn) {
      if (window.scrollY > 260) {
        toTopBtn.classList.add("show");
      } else {
        toTopBtn.classList.remove("show");
      }
    }

    if (quickSidebar) {
      if (window.scrollY > 180) {
        quickSidebar.classList.add("show");
      } else {
        quickSidebar.classList.remove("show");
      }
    }
  };

  window.addEventListener("scroll", updateFloatingUi, { passive: true });
  updateFloatingUi();

  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const blocks = document.querySelectorAll("pre code");

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const rules = [
    { pattern: /"(?:[^"\\]|\\.)*"/g, className: "tok-string" },
    { pattern: /\bheart\b/g, className: "tok-heart" },
    { pattern: /\bsecret\b/g, className: "tok-secret" },
    { pattern: /\bwhisper\b/g, className: "tok-whisper" },
    { pattern: /\biflove\b/g, className: "tok-iflove" },
    { pattern: /\belselove\b/g, className: "tok-elselove" },
    { pattern: /\belseheart\b/g, className: "tok-elseheart" },
    { pattern: /\bforever\b|\bbreakup\b/g, className: "tok-boolean" },
    { pattern: /\b\d+(?:\.\d+)?\b/g, className: "tok-number" }
  ];

  blocks.forEach((block) => {
    if (block.children.length > 0) {
      return;
    }

    const raw = block.textContent || "";
    const lines = raw.split("\n").map((line) => {
      let htmlLine = escapeHtml(line);

      rules.forEach(({ pattern, className }) => {
        htmlLine = htmlLine.replace(pattern, (match) => `<span class="${className}">${match}</span>`);
      });

      if (/\bsecret\b/i.test(line) || /\bsecrect\b/i.test(line)) {
        return `<span class="tok-secret-line">${htmlLine}</span>`;
      }

      return htmlLine;
    });

    block.innerHTML = lines.join("\n");
  });
});
