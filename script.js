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

  const loveEditor = document.getElementById("loveEditor");
  const loveEditorPreview = document.getElementById("loveEditorPreview");
  const loveOutput = document.getElementById("loveOutput");
  const loveRun = document.getElementById("loveRun");
  const loveReset = document.getElementById("loveReset");
  const defaultLoveCode = loveEditor ? loveEditor.value : "";

  const loveRules = [
    { pattern: /"(?:[^"\\]|\\.)*"/g, className: "tok-string" },
    { pattern: /\bmain\.class\b/g, className: "tok-main" },
    { pattern: /\bheart\b/g, className: "tok-heart" },
    { pattern: /\bsecret\b/g, className: "tok-secret" },
    { pattern: /\bwhisper\b/g, className: "tok-whisper" },
    { pattern: /\biflove\b/g, className: "tok-iflove" },
    { pattern: /\belselove\b/g, className: "tok-elselove" },
    { pattern: /\belseheart\b/g, className: "tok-elseheart" },
    { pattern: /\bforever\b|\bbreakup\b/g, className: "tok-boolean" },
    { pattern: /\b\d+(?:\.\d+)?\b/g, className: "tok-number" }
  ];

  const highlightLoveEditor = (code) => {
    if (!loveEditorPreview) return;
    const lines = (code || "").replace(/\r\n/g, "\n").split("\n").map((line) => {
      let htmlLine = escapeHtml(line);

      loveRules.forEach(({ pattern, className }) => {
        htmlLine = htmlLine.replace(pattern, (match) => `<span class="${className}">${match}</span>`);
      });

      if (/\bsecret\b/i.test(line) || /\bsecrect\b/i.test(line)) {
        return `<span class="tok-secret-line">${htmlLine}</span>`;
      }

      return htmlLine;
    });

    loveEditorPreview.innerHTML = lines.join("\n");
  };

  const normalizeLoveLang = (code) =>
    code
      .replace(/\r\n/g, "\n")
      .replace(/}\s*elseheart\s*{/g, "}\nelseheart {")
      .replace(/}\s*elselove\s*/g, "}\nelselove ");

  const formatValue = (value) => {
    if (value === true) return "forever";
    if (value === false) return "breakup";
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const isTruthy = (value) => {
    if (value === true || value === false) return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value.trim().length > 0;
    return Boolean(value);
  };

  const tokenize = (text) => {
    const tokens = [];
    let index = 0;

    const push = (type, value) => tokens.push({ type, value });

    while (index < text.length) {
      const char = text[index];

      if (/\s/.test(char)) {
        index += 1;
        continue;
      }

      if (char === '"') {
        let value = "";
        index += 1;
        while (index < text.length && text[index] !== '"') {
          if (text[index] === "\\" && index + 1 < text.length) {
            value += text[index + 1];
            index += 2;
          } else {
            value += text[index];
            index += 1;
          }
        }
        if (text[index] !== '"') {
          throw new Error("Unclosed string literal.");
        }
        index += 1;
        push("string", value);
        continue;
      }

      if (/[0-9]/.test(char)) {
        let value = char;
        index += 1;
        while (index < text.length && /[0-9.]/.test(text[index])) {
          value += text[index];
          index += 1;
        }
        push("number", Number(value));
        continue;
      }

      if (/[A-Za-z_]/.test(char)) {
        let value = char;
        index += 1;
        while (index < text.length && /[A-Za-z0-9_]/.test(text[index])) {
          value += text[index];
          index += 1;
        }
        push("identifier", value);
        continue;
      }

      const twoChar = text.slice(index, index + 2);
      if (["==", "!=", ">=", "<="].includes(twoChar)) {
        push("operator", twoChar);
        index += 2;
        continue;
      }

      if (["<", ">", "+", "(", ")", ","].includes(char)) {
        const type = char === "+" || char === "<" || char === ">" ? "operator" : "punct";
        push(type, char);
        index += 1;
        continue;
      }

      throw new Error(`Unexpected character: ${char}`);
    }

    return tokens;
  };

  const evaluateExpression = (expression, vars) => {
    const tokens = tokenize(expression);
    let position = 0;

    const peek = () => tokens[position];
    const consume = () => tokens[position++];
    const match = (type, value) => {
      const token = tokens[position];
      if (!token) return false;
      if (token.type !== type) return false;
      if (value !== undefined && token.value !== value) return false;
      position += 1;
      return true;
    };

    const parsePrimary = () => {
      const token = consume();
      if (!token) {
        throw new Error("Unexpected end of expression.");
      }

      if (token.type === "number" || token.type === "string") {
        return token.value;
      }

      if (token.type === "identifier") {
        if (match("punct", "(")) {
          const args = [];
          if (!match("punct", ")")) {
            do {
              args.push(parseComparison());
            } while (match("punct", ","));
            if (!match("punct", ")")) {
              throw new Error("Expected closing ')' in function call.");
            }
          }

          if (token.value !== "hug") {
            throw new Error(`Unsupported function: ${token.value}`);
          }

          return args.map((value) => formatValue(value)).join("");
        }

        if (token.value === "forever") return true;
        if (token.value === "breakup") return false;
        if (Object.prototype.hasOwnProperty.call(vars, token.value)) {
          return vars[token.value];
        }
        return token.value;
      }

      if (token.type === "punct" && token.value === "(") {
        const value = parseComparison();
        if (!match("punct", ")")) {
          throw new Error("Expected closing ')' in expression.");
        }
        return value;
      }

      throw new Error(`Unexpected token: ${token.value}`);
    };

    const parseAdditive = () => {
      let value = parsePrimary();
      while (match("operator", "+")) {
        const right = parsePrimary();
        if (typeof value === "number" && typeof right === "number") {
          value = value + right;
        } else {
          value = formatValue(value) + formatValue(right);
        }
      }
      return value;
    };

    const parseComparison = () => {
      let value = parseAdditive();
      while (true) {
        const token = peek();
        if (!token || token.type !== "operator") break;
        const op = token.value;
        if (!["==", "!=", ">", "<", ">=", "<="].includes(op)) break;
        consume();
        const right = parseAdditive();
        switch (op) {
          case "==":
            value = value == right; // LoveLang-style loose equality
            break;
          case "!=":
            value = value != right;
            break;
          case ">":
            value = value > right;
            break;
          case "<":
            value = value < right;
            break;
          case ">=":
            value = value >= right;
            break;
          case "<=":
            value = value <= right;
            break;
          default:
            break;
        }
      }
      return value;
    };

    const result = parseComparison();
    if (position < tokens.length) {
      throw new Error("Unexpected tokens at end of expression.");
    }
    return result;
  };

  const parseCondition = (line, keyword) => {
    let after = line.slice(keyword.length).trim();
    const braceIndex = after.indexOf("{");
    if (braceIndex !== -1) {
      after = after.slice(0, braceIndex).trim();
    }
    if (after.startsWith("(") && after.endsWith(")")) {
      after = after.slice(1, -1).trim();
    }
    if (!after) {
      throw new Error(`${keyword} needs a condition.`);
    }
    return after;
  };

  const countChar = (value, char) => value.split(char).length - 1;

  const extractBlock = (lines, startIndex) => {
    let foundStart = false;
    let braceDepth = 0;
    let endIndex = startIndex;
    const blockLines = [];

    for (let i = startIndex; i < lines.length; i += 1) {
      const line = lines[i];
      if (!foundStart) {
        const openIndex = line.indexOf("{");
        if (openIndex === -1) {
          continue;
        }
        foundStart = true;
        braceDepth = 1;
        const after = line.slice(openIndex + 1);
        const afterContent = after.split("}")[0];
        if (afterContent.trim()) {
          blockLines.push(afterContent);
        }
        braceDepth += countChar(after, "{");
        braceDepth -= countChar(after, "}");
        if (braceDepth === 0) {
          endIndex = i;
          break;
        }
      } else {
        braceDepth += countChar(line, "{");
        braceDepth -= countChar(line, "}");
        if (braceDepth <= 0) {
          const beforeClose = line.split("}")[0];
          if (beforeClose.trim()) {
            blockLines.push(beforeClose);
          }
          endIndex = i;
          break;
        }
        blockLines.push(line);
      }
    }

    if (!foundStart) {
      throw new Error("Missing '{' for block.");
    }

    return { blockLines, endIndex };
  };

  const findMainBlock = (lines) => {
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (line.startsWith("main.class")) {
        return { index: i, block: extractBlock(lines, i) };
      }
    }
    return null;
  };

  const executeLines = (lines, state) => {
    for (let i = 0; i < lines.length; i += 1) {
      const rawLine = lines[i];
      const line = rawLine.trim();

      if (!line) {
        continue;
      }

      if (/^secret\b/i.test(line)) {
        continue;
      }

      if (line.startsWith("main.class")) {
        const block = extractBlock(lines, i);
        executeLines(block.blockLines, state);
        i = block.endIndex;
        continue;
      }

      if (line.startsWith("heart ")) {
        const match = line.match(/^heart\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if (!match) {
          throw new Error(`Invalid heart declaration: ${line}`);
        }
        const [, name, expression] = match;
        state.vars[name] = evaluateExpression(expression, state.vars);
        continue;
      }

      if (line.startsWith("whisper")) {
        const match = line.match(/^whisper\s*\((.*)\)\s*$/);
        if (!match) {
          throw new Error(`Invalid whisper call: ${line}`);
        }
        const value = evaluateExpression(match[1], state.vars);
        state.output.push(formatValue(value));
        continue;
      }

      if (line.startsWith("iflove")) {
        const conditionText = parseCondition(line, "iflove");
        const firstBlock = extractBlock(lines, i);
        const branches = [{ condition: conditionText, blockLines: firstBlock.blockLines }];
        let cursor = firstBlock.endIndex;
        let nextIndex = cursor + 1;

        while (nextIndex < lines.length) {
          const nextLine = lines[nextIndex].trim();
          if (!nextLine) {
            nextIndex += 1;
            continue;
          }

          if (nextLine.startsWith("elselove")) {
            const condition = parseCondition(nextLine, "elselove");
            const block = extractBlock(lines, nextIndex);
            branches.push({ condition, blockLines: block.blockLines });
            cursor = block.endIndex;
            nextIndex = block.endIndex + 1;
            continue;
          }

          if (nextLine.startsWith("elseheart")) {
            const block = extractBlock(lines, nextIndex);
            branches.push({ condition: null, blockLines: block.blockLines });
            cursor = block.endIndex;
            nextIndex = block.endIndex + 1;
          }

          break;
        }

        let executed = false;
        for (const branch of branches) {
          if (branch.condition === null || isTruthy(evaluateExpression(branch.condition, state.vars))) {
            executeLines(branch.blockLines, state);
            executed = true;
            break;
          }
        }

        if (!executed && branches.length === 0) {
          throw new Error("No branches found for iflove.");
        }

        i = cursor;
        continue;
      }

      if (line.startsWith("elselove") || line.startsWith("elseheart")) {
        throw new Error("elseheart/elselove must follow an iflove block.");
      }

      throw new Error(`Unsupported line: ${line}`);
    }
  };

  const runLoveLang = (code) => {
    const state = { vars: Object.create(null), output: [] };
    const normalized = normalizeLoveLang(code);
    const lines = normalized.split("\n");
    const mainBlock = findMainBlock(lines);
    if (mainBlock) {
      executeLines(mainBlock.block.blockLines, state);
    } else {
      executeLines(lines, state);
    }
    return state;
  };

  const renderLoveOutput = (lines) => {
    if (!loveOutput) return;
    loveOutput.textContent = lines.join("\n").trim();
  };

  if (loveEditor && loveRun && loveOutput) {
    loveRun.addEventListener("click", () => {
      try {
        const result = runLoveLang(loveEditor.value);
        renderLoveOutput(result.output);
      } catch (error) {
        renderLoveOutput([`Error: ${error.message}`]);
      }
    });
  }

  if (loveEditor && loveReset) {
    loveReset.addEventListener("click", () => {
      loveEditor.value = defaultLoveCode;
      renderLoveOutput(["Ready to run your love code."]);
      highlightLoveEditor(loveEditor.value);
    });
  }

  if (loveOutput) {
    loveOutput.textContent = "Ready to run your love code.";
  }

  if (loveEditor) {
    highlightLoveEditor(loveEditor.value);
    loveEditor.addEventListener("input", (event) => {
      highlightLoveEditor(event.target.value);
    });
    loveEditor.addEventListener("scroll", () => {
      if (!loveEditorPreview) return;
      loveEditorPreview.scrollTop = loveEditor.scrollTop;
      loveEditorPreview.scrollLeft = loveEditor.scrollLeft;
    });
  }

  // Heart cursor with spark effects
  document.addEventListener("mousemove", (e) => {
    const chance = Math.random();
    if (chance < 0.3) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.textContent = "✨";
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      spark.style.left = e.clientX + "px";
      spark.style.top = e.clientY + "px";
      spark.style.setProperty("--tx", tx + "px");
      spark.style.setProperty("--ty", ty + "px");
      
      document.body.appendChild(spark);
      
      setTimeout(() => spark.remove(), 800);
    }
  });
});
