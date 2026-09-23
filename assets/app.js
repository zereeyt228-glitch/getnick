(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const chars = (value) => Array.from(value || "");
  const charLength = (value) => chars(value).length;
  const takeChars = (value, length) => chars(value).slice(0, Math.max(0, length)).join("");

  const nickData = {
    gaming: {
      starts: ["Nova","Vex","Rift","Zero","Neo","Kiro","Zyn","Luma","Drift","Blaze","Aero","Raze","Echo","Nox","Flux","Miro","Skye","Keen","Axel","Riven"],
      ends: ["ix","on","ex","or","ify","byte","core","zen","wave","shot","play","void","rush","fox","spark","x","er","fy"]
    },
    pro: {
      starts: ["vex","nix","kry","zen","qor","rux","zyr","nex","vox","rex","syn","kiv","taz","mav","sol","kai","xen","yor"],
      ends: ["x","z","q","v","r","ix","ez","ox","yn","or","en"]
    },
    cyber: {
      starts: ["Cipher","Neon","Glitch","Hex","Byte","Chrome","Proxy","Vector","Kernel","Static","Quantum","Pixel","Null","Ghost","Signal","Circuit"],
      ends: ["404","X","EXE","SYS","OS","RX","BYTE","NET","NULL","0X","V2","CTRL"]
    },
    dark: {
      starts: ["Noct","Void","Grim","Ash","Dusk","Raven","Shade","Wraith","Night","Obsid","Mourn","Abyss","Hollow","Black"],
      ends: ["veil","born","fall","bane","shade","fang","mist","void","less","mourne","heart","crypt"]
    },
    fantasy: {
      starts: ["Ael","Ery","Vael","Syl","Thar","Kael","Myr","Lun","Aer","Ily","Nyx","Ser","Dra","Vel"],
      ends: ["ion","aris","eth","wyn","iel","ora","une","dris","ael","orin","ara","ith"]
    },
    funny: {
      starts: ["Potato","Laggy","Oops","Bonk","Sneaky","Bread","Pickle","Toaster","Goblin","Duck","Meme","Borsch","Pigeon","Turbo"],
      ends: ["Boss","Main","Enjoyer","Dealer","Pro","Lord","Moment","Machine","Online","GG"]
    }
  };

  const fancyMap = {
    a:"α", b:"ɓ", c:"¢", d:"∂", e:"є", f:"ƒ", g:"ɢ", h:"н", i:"ι", j:"נ",
    k:"κ", l:"ℓ", m:"м", n:"η", o:"σ", p:"ρ", q:"զ", r:"я", s:"ѕ", t:"т",
    u:"υ", v:"ν", w:"ω", x:"χ", y:"у", z:"z"
  };

  const nameData = {
    project: {
      first: ["Nova","Pixel","Bright","Neon","Orbit","Echo","Vector","Cloud","Luma","Nexa","Pulse","Drift"],
      second: ["Forge","Lab","Core","Works","Base","Flow","Nest","Grid","Spark","Studio","Stack","Point"]
    },
    channel: {
      first: ["Nova","Turbo","Chill","Pixel","Night","Echo","Luma","Daily","Vibe","Neon","Cozy","Zero"],
      second: ["Room","Wave","Cast","Live","Hub","Spot","Zone","Stream","Talk","Club","TV","Base"]
    },
    team: {
      first: ["Nova","Rift","Ghost","Vortex","Neon","Apex","Void","Rapid","Alpha","Hyper","Night","Iron"],
      second: ["Crew","Squad","Unit","Core","Force","Pack","Team","Guild","Clan","Rush","Wing","Order"]
    },
    brand: {
      first: ["Nexa","Luma","Vero","Mira","Aero","Kivo","Zeno","Rivo","Elara","Nova","Vexa","Sora"],
      second: ["Labs","Studio","Works","Co","One","Flow","Craft","Space","House","Lab","Point","Base"]
    }
  };

  let toastTimer;
  function toast(message) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  }

  async function copyText(value) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    toast("Скопировано");
  }

  function setupTheme() {
    const saved = localStorage.getItem("getnick-theme");
    const systemLight = matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.dataset.theme = saved || (systemLight ? "light" : "dark");

    const button = $("#theme-toggle");
    const sync = () => {
      if (!button) return;
      const isLight = document.documentElement.dataset.theme === "light";
      button.textContent = isLight ? "☀" : "☾";
      button.setAttribute("aria-label", isLight ? "Включить тёмную тему" : "Включить светлую тему");
      button.title = button.getAttribute("aria-label");
    };

    button?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("getnick-theme", next);
      sync();
    });
    sync();
  }

  function setupNavigation() {
    const header = $(".site-header");
    const menu = $("#nav-links");
    const toggle = $("#mobile-toggle");

    const syncHeader = () => header?.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", syncHeader, { passive: true });
    syncHeader();

    toggle?.addEventListener("click", () => {
      const open = menu?.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(Boolean(open)));
    });

    $$("#nav-links a").forEach(link => link.addEventListener("click", () => {
      menu?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    }));
  }

  function sanitizeAffix(value) {
    return chars((value || "").trim().replace(/\s+/g, "")).slice(0, 6).join("");
  }

  function fitAffixes(prefix, suffix, budget) {
    let left = chars(prefix);
    let right = chars(suffix);
    while (left.length + right.length > budget) {
      if (right.length >= left.length && right.length) right.pop();
      else if (left.length) left.pop();
      else break;
    }
    return [left.join(""), right.join("")];
  }

  function stylize(value) {
    return chars(value).map(ch => {
      const lower = ch.toLowerCase();
      if (!fancyMap[lower]) return ch;
      return ch === ch.toUpperCase() ? fancyMap[lower].toUpperCase() : fancyMap[lower];
    }).join("");
  }

  function buildCore(pack, length, options) {
    const source = (randomItem(pack.starts) + randomItem(pack.ends)).replace(/[^a-z0-9]/gi, "");
    const pool = chars((pack.starts.join("") + pack.ends.join("")).replace(/[^a-z]/gi, "") || "getnick");
    let result = chars(source);

    while (result.length < length) result.push(randomItem(pool));
    result = result.slice(0, length);

    if (options.numbers && length > 0) {
      const pos = length === 1 ? 0 : randomInt(Math.max(0, length - 3), length - 1);
      result[pos] = String(randomInt(0, 9));
    }

    if (options.separator && length >= 5) {
      const pos = randomInt(2, length - 2);
      result[pos] = randomItem(["_", "-", "."]);
    }

    if (options.caseMix) {
      result = result.map((ch, index) => {
        if (!/[a-z]/i.test(ch)) return ch;
        return (index % 2 === 0 || Math.random() > .65) ? ch.toUpperCase() : ch.toLowerCase();
      });
    }

    return result.join("");
  }

  function buildNick(options) {
    const target = Math.max(5, Math.min(18, Number(options.length) || 10));
    const pack = nickData[options.style] || nickData.gaming;

    const decorations = options.symbols
      ? randomItem([["✦","✦"],["[","]"],["×","×"],["‹","›"],["_","_"]])
      : ["",""];

    const decorationLength = charLength(decorations[0]) + charLength(decorations[1]);
    const affixBudget = Math.max(0, target - decorationLength - 1);
    let [prefix, suffix] = fitAffixes(sanitizeAffix(options.prefix), sanitizeAffix(options.suffix), affixBudget);

    const coreLength = Math.max(1, target - decorationLength - charLength(prefix) - charLength(suffix));
    let core = buildCore(pack, coreLength, options);

    let result = decorations[0] + prefix + core + suffix + decorations[1];
    if (options.fancy) result = stylize(result);

    // Финальная страховка: длина результата всегда совпадает со значением ползунка.
    if (charLength(result) > target) result = takeChars(result, target);
    while (charLength(result) < target) {
      const filler = randomItem(chars("xznqv"));
      const insertAt = Math.max(0, charLength(result) - charLength(decorations[1]));
      const arr = chars(result);
      arr.splice(insertAt, 0, filler);
      result = arr.join("");
    }
    return result;
  }

  const favoritesKey = "getnick-favorites-v3";
  function getFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
      return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
    } catch {
      return [];
    }
  }

  function saveFavorites(items) {
    localStorage.setItem(favoritesKey, JSON.stringify(items.slice(0, 20)));
    renderFavorites();
  }

  function addFavorite(value) {
    if (!value) return;
    const next = [value, ...getFavorites().filter(item => item !== value)].slice(0, 20);
    saveFavorites(next);
    toast("Добавлено в избранное");
  }

  function renderFavorites() {
    const root = $("#favorites-list");
    if (!root) return;
    root.innerHTML = "";
    const items = getFavorites();

    if (!items.length) {
      const empty = document.createElement("span");
      empty.className = "empty-state";
      empty.textContent = "Пока пусто — сохраняй понравившиеся ники.";
      root.appendChild(empty);
      return;
    }

    items.forEach(value => {
      const chip = document.createElement("span");
      chip.className = "favorite-chip";

      const label = document.createElement("button");
      label.type = "button";
      label.className = "favorite-value";
      label.textContent = value;
      label.title = "Скопировать";
      label.addEventListener("click", () => copyText(value));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Удалить ${value}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => saveFavorites(getFavorites().filter(item => item !== value)));

      chip.append(label, remove);
      root.appendChild(chip);
    });
  }

  function setupNickGenerator() {
    const root = $("[data-generator]");
    if (!root) return;

    const output = $("#nick-output", root);
    const length = $("#nick-length", root);
    const lengthOutput = $("#nick-length-output", root);
    const count = $("#nick-count", root);

    const getOptions = () => ({
      style: $("#nick-style", root)?.value || "gaming",
      length: Number(length?.value || 10),
      prefix: $("#nick-prefix", root)?.value || "",
      suffix: $("#nick-suffix", root)?.value || "",
      numbers: Boolean($("#opt-numbers", root)?.checked),
      separator: Boolean($("#opt-separator", root)?.checked),
      caseMix: Boolean($("#opt-case", root)?.checked),
      symbols: Boolean($("#opt-symbols", root)?.checked),
      fancy: Boolean($("#opt-fancy", root)?.checked)
    });

    const generate = () => {
      const value = buildNick(getOptions());
      if (output) {
        output.textContent = value;
        output.dataset.value = value;
      }
      if (count) count.textContent = `${charLength(value)} символов`;
      return value;
    };

    length?.addEventListener("input", () => {
      if (lengthOutput) lengthOutput.value = length.value;
      generate();
    });

    ["nick-style","opt-numbers","opt-separator","opt-case","opt-symbols","opt-fancy"].forEach(id => {
      $("#" + id, root)?.addEventListener("change", generate);
    });

    ["nick-prefix","nick-suffix"].forEach(id => {
      $("#" + id, root)?.addEventListener("input", generate);
    });

    $("#generate-btn", root)?.addEventListener("click", generate);
    $("#regenerate-btn", root)?.addEventListener("click", generate);
    $("#copy-btn", root)?.addEventListener("click", () => copyText(output?.dataset.value || output?.textContent || ""));
    $("#favorite-btn", root)?.addEventListener("click", () => addFavorite(output?.dataset.value || output?.textContent || ""));

    if (lengthOutput && length) lengthOutput.value = length.value;
    generate();
  }

  function setupPasswordGenerator() {
    const root = $("[data-password-generator]");
    if (!root) return;

    const output = $("#password-output", root);
    const length = $("#password-length", root);
    const lengthOutput = $("#password-length-output", root);

    const securePick = alphabet => {
      const value = new Uint32Array(1);
      crypto.getRandomValues(value);
      return alphabet[value[0] % alphabet.length];
    };

    const generate = () => {
      const lower = "abcdefghijkmnopqrstuvwxyz";
      const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      const digits = "23456789";
      const symbols = "!@#$%^&*_-+=?";
      const groups = [];

      if ($("#pass-lower", root)?.checked) groups.push(lower);
      if ($("#pass-upper", root)?.checked) groups.push(upper);
      if ($("#pass-digits", root)?.checked) groups.push(digits);
      if ($("#pass-symbols", root)?.checked) groups.push(symbols);
      if (!groups.length) groups.push(lower, upper, digits);

      const pool = groups.join("");
      const target = Math.max(groups.length, Number(length?.value || 18));
      const result = groups.map(securePick);

      while (result.length < target) result.push(securePick(pool));

      for (let i = result.length - 1; i > 0; i--) {
        const value = new Uint32Array(1);
        crypto.getRandomValues(value);
        const j = value[0] % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
      }

      const password = result.join("");
      if (output) {
        output.textContent = password;
        output.dataset.value = password;
      }
    };

    length?.addEventListener("input", () => {
      if (lengthOutput) lengthOutput.value = length.value;
      generate();
    });

    ["pass-lower","pass-upper","pass-digits","pass-symbols"].forEach(id => {
      $("#" + id, root)?.addEventListener("change", generate);
    });

    $("#password-generate-btn", root)?.addEventListener("click", generate);
    $("#password-copy-btn", root)?.addEventListener("click", () => copyText(output?.dataset.value || output?.textContent || ""));

    if (lengthOutput && length) lengthOutput.value = length.value;
    generate();
  }

  function setupNameGenerator() {
    const root = $("[data-name-generator]");
    if (!root) return;

    const output = $("#name-output", root);

    const generate = () => {
      const category = $("#name-category", root)?.value || "project";
      const pack = nameData[category] || nameData.project;
      const compact = Boolean($("#name-compact", root)?.checked);
      const number = Boolean($("#name-number", root)?.checked);

      let value = randomItem(pack.first) + (compact ? "" : " ") + randomItem(pack.second);
      if (number) value += String(randomInt(2, 99));

      if (output) {
        output.textContent = value;
        output.dataset.value = value;
      }
      return value;
    };

    $("#name-category", root)?.addEventListener("change", generate);
    $("#name-compact", root)?.addEventListener("change", generate);
    $("#name-number", root)?.addEventListener("change", generate);
    $("#name-generate-btn", root)?.addEventListener("click", generate);
    $("#name-copy-btn", root)?.addEventListener("click", () => copyText(output?.dataset.value || output?.textContent || ""));
    generate();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    setupNavigation();
    setupNickGenerator();
    setupPasswordGenerator();
    setupNameGenerator();
    renderFavorites();

    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  });
})();