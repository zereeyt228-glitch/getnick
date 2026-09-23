(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const data = {
    gaming: {
      starts: ["Nova","Vex","Rift","Zero","Neo","Kiro","Zyn","Luma","Drift","Blaze","Aero","Raze","Echo","Nox","Flux","Miro","Skye","Keen","Axel","Riven"],
      ends: ["ix","on","ex","or","ify","byte","core","zen","wave","shot","play","void","rush","fox","spark","x","er","fy"]
    },
    pro: {
      starts: ["vex","nix","kry","zen","qor","rux","zyr","nex","vox","rex","syn","kiv","taz","mav","sol","kai","xen","yor"],
      ends: ["","x","z","q","v","r","ix","ez","ox","yn","or","en"]
    },
    cyber: {
      starts: ["Cipher","Neon","Glitch","Hex","Byte","Chrome","Proxy","Vector","Kernel","Static","Quantum","Pixel","Null","Ghost","Signal","Circuit"],
      ends: ["404","X","EXE","SYS","OS","RX","BYTE","NET","NULL","0X","V2","CTRL"]
    },
    dark: {
      starts: ["Noct","Void","Grim","Ash","Dusk","Raven","Shade","Wraith","Night","Obsid","Mourn","Abyss","Hollow","Black"],
      ends: ["veil","born","fall","bane","shade","fang","mist","void","less","mourne","heart","crypt"]
    },
    funny: {
      starts: ["Potato","Laggy","Oops","Bonk","Sneaky","Bread","Pickle","Toaster","Goblin","Duck","Meme","Borsch","Pigeon","Turbo"],
      ends: ["Boss",".exe","Main","Enjoyer","Dealer","404","Pro","Lord","Moment","Machine","Online","GG"]
    },
    fantasy: {
      starts: ["Ael","Ery","Vael","Syl","Thar","Kael","Myr","Lun","Aer","Ily","Nyx","Ser","Dra","Vel"],
      ends: ["ion","aris","eth","wyn","iel","ora","une","dris","ael","orin","ara","ith"]
    }
  };

  const fancyMap = {
    a:"α",b:"ɓ",c:"¢",d:"∂",e:"є",f:"ƒ",g:"ɢ",h:"н",i:"ι",j:"נ",k:"κ",l:"ℓ",m:"м",n:"η",o:"σ",p:"ρ",q:"զ",r:"я",s:"ѕ",t:"т",u:"υ",v:"ν",w:"ω",x:"χ",y:"у",z:"z"
  };

  function smartTrim(value, max) {
    if (value.length <= max) return value;
    return value.slice(0, Math.max(3, max));
  }

  function decorate(value, enabled) {
    if (!enabled) return value;
    const variants = [
      v => `✦${v}✦`,
      v => `⟦${v}⟧`,
      v => `『${v}』`,
      v => `×${v}×`,
      v => `_${v}_`
    ];
    return randomItem(variants)(value);
  }

  function stylize(value, enabled) {
    if (!enabled) return value;
    return [...value].map(ch => {
      const low = ch.toLowerCase();
      if (!fancyMap[low]) return ch;
      return ch === ch.toUpperCase() ? fancyMap[low].toUpperCase() : fancyMap[low];
    }).join("");
  }

  function buildNick(options) {
    const pack = data[options.style] || data.gaming;
    let nick = randomItem(pack.starts) + randomItem(pack.ends);

    if (options.separator && Math.random() > .45) {
      const seps = ["_","-","."];
      const pivot = randomInt(2, Math.max(2, nick.length - 2));
      nick = nick.slice(0, pivot) + randomItem(seps) + nick.slice(pivot);
    }

    if (options.numbers) {
      const digits = String(randomInt(7, 999));
      nick += Math.random() > .45 ? digits : digits.slice(0, 2);
    }

    if (options.caseMix) {
      nick = [...nick].map((ch, i) => /[a-z]/i.test(ch) && (i % 2 === 0 || Math.random() > .62) ? ch.toUpperCase() : ch).join("");
    }

    const prefix = (options.prefix || "").trim().replace(/\s+/g, "");
    const suffix = (options.suffix || "").trim().replace(/\s+/g, "");

    const decorationBudget = options.symbols ? 2 : 0;
    const coreMax = Math.max(3, options.length - prefix.length - suffix.length - decorationBudget);
    nick = smartTrim(nick, coreMax);

    nick = prefix + nick + suffix;
    nick = stylize(nick, options.fancy);
    nick = decorate(nick, options.symbols);

    return nick;
  }

  function setupTheme() {
    const saved = localStorage.getItem("getnick-theme");
    const initial = saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = initial;
    const btn = $("#theme-toggle");

    const sync = () => {
      if (!btn) return;
      const dark = document.documentElement.dataset.theme !== "light";
      btn.textContent = dark ? "☾" : "☀";
      btn.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
      btn.title = btn.getAttribute("aria-label");
    };

    btn?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("getnick-theme", next);
      sync();
    });
    sync();
  }

  function setupNavigation() {
    const header = $(".site-header");
    const toggle = $("#mobile-toggle");
    const links = $("#nav-links");
    const onScroll = () => header?.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toggle?.addEventListener("click", () => {
      const open = links?.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(Boolean(open)));
    });
    $$("#nav-links a").forEach(a => a.addEventListener("click", () => links?.classList.remove("open")));
  }

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
    toastTimer = setTimeout(() => el.classList.remove("show"), 1700);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast("Скопировано");
  }

  function setupGenerator() {
    const root = $("[data-generator]");
    if (!root) return;

    const output = $("#nick-output", root);
    const length = $("#nick-length", root);
    const lengthOut = $("#nick-length-output", root);
    const style = $("#nick-style", root);
    const prefix = $("#nick-prefix", root);
    const suffix = $("#nick-suffix", root);
    const numbers = $("#opt-numbers", root);
    const separator = $("#opt-separator", root);
    const caseMix = $("#opt-case", root);
    const symbols = $("#opt-symbols", root);
    const fancy = $("#opt-fancy", root);

    const currentOptions = () => ({
      style: style?.value || "gaming",
      length: Number(length?.value || 10),
      prefix: prefix?.value || "",
      suffix: suffix?.value || "",
      numbers: Boolean(numbers?.checked),
      separator: Boolean(separator?.checked),
      caseMix: Boolean(caseMix?.checked),
      symbols: Boolean(symbols?.checked),
      fancy: Boolean(fancy?.checked)
    });

    const generate = () => {
      const value = buildNick(currentOptions());
      if (output) {
        output.textContent = value;
        output.dataset.value = value;
      }
      updateCheckLinks(value);
      return value;
    };

    length?.addEventListener("input", () => {
      if (lengthOut) lengthOut.value = length.value;
    });

    $("#generate-btn", root)?.addEventListener("click", generate);
    $("#regenerate-btn", root)?.addEventListener("click", generate);
    $("#copy-btn", root)?.addEventListener("click", () => copyText(output?.dataset.value || output?.textContent || ""));
    $("#favorite-btn", root)?.addEventListener("click", () => {
      const value = output?.dataset.value || output?.textContent || "";
      if (!value) return;
      addFavorite(value);
    });

    [style, prefix, suffix, numbers, separator, caseMix, symbols, fancy].filter(Boolean).forEach(el => {
      el.addEventListener("change", () => {
        if (el === prefix || el === suffix) return;
        generate();
      });
    });

    generate();
  }

  const favoritesKey = "getnick-favorites-v2";
  function getFavorites() {
    try {
      const value = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
      return Array.isArray(value) ? value.slice(0, 20) : [];
    } catch { return []; }
  }

  function saveFavorites(items) {
    localStorage.setItem(favoritesKey, JSON.stringify(items.slice(0, 20)));
    renderFavorites();
  }

  function addFavorite(value) {
    const items = getFavorites();
    const next = [value, ...items.filter(x => x !== value)].slice(0, 20);
    saveFavorites(next);
    toast("Добавлено в избранное");
  }

  function renderFavorites() {
    const box = $("#favorites-list");
    if (!box) return;
    const items = getFavorites();
    box.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("span");
      empty.className = "empty-state";
      empty.textContent = "Пока пусто — сохраняй понравившиеся ники.";
      box.appendChild(empty);
      return;
    }

    items.forEach(value => {
      const chip = document.createElement("span");
      chip.className = "favorite-chip";

      const text = document.createElement("span");
      text.textContent = value;
      text.tabIndex = 0;
      text.title = "Нажми, чтобы скопировать";
      text.addEventListener("click", () => copyText(value));

      const del = document.createElement("button");
      del.type = "button";
      del.setAttribute("aria-label", `Удалить ${value} из избранного`);
      del.textContent = "×";
      del.addEventListener("click", () => saveFavorites(getFavorites().filter(x => x !== value)));

      chip.append(text, del);
      box.appendChild(chip);
    });
  }

  function updateCheckLinks(value) {
    const encoded = encodeURIComponent(value);
    const links = {
      steam: `https://steamcommunity.com/search/users/#text=${encoded}`,
      twitch: `https://www.twitch.tv/${encoded}`,
      roblox: `https://www.roblox.com/search/users?keyword=${encoded}`,
      google: `https://www.google.com/search?q=%22${encoded}%22`
    };
    $$("[data-check]").forEach(a => {
      const target = a.dataset.check;
      if (links[target]) a.href = links[target];
    });
  }

  function setupPasswordGenerator() {
    const root = $("[data-password-generator]");
    if (!root) return;
    const output = $("#password-output", root);
    const length = $("#password-length", root);
    const lengthOut = $("#password-length-output", root);

    const generate = () => {
      const lower = "abcdefghijkmnopqrstuvwxyz";
      const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      const digits = "23456789";
      const symbols = "!@#$%^&*_-+=?";
      let pool = "";
      if ($("#pass-lower", root)?.checked) pool += lower;
      if ($("#pass-upper", root)?.checked) pool += upper;
      if ($("#pass-digits", root)?.checked) pool += digits;
      if ($("#pass-symbols", root)?.checked) pool += symbols;
      if (!pool) pool = lower + upper + digits;

      const n = Number(length?.value || 18);
      const enabled = [];
      if ($("#pass-lower", root)?.checked) enabled.push(lower);
      if ($("#pass-upper", root)?.checked) enabled.push(upper);
      if ($("#pass-digits", root)?.checked) enabled.push(digits);
      if ($("#pass-symbols", root)?.checked) enabled.push(symbols);
      if (!enabled.length) enabled.push(lower, upper, digits);

      const securePick = chars => {
        const value = new Uint32Array(1);
        crypto.getRandomValues(value);
        return chars[value[0] % chars.length];
      };

      const chars = enabled.map(securePick);
      while (chars.length < n) chars.push(securePick(pool));

      for (let i = chars.length - 1; i > 0; i--) {
        const value = new Uint32Array(1);
        crypto.getRandomValues(value);
        const j = value[0] % (i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }

      const password = chars.join("");
      output.textContent = password;
      output.dataset.value = password;
    };

    length?.addEventListener("input", () => {
      if (lengthOut) lengthOut.value = length.value;
      generate();
    });
    $$("#pass-lower, #pass-upper, #pass-digits, #pass-symbols", root).forEach(el => el.addEventListener("change", generate));
    $("#password-generate-btn", root)?.addEventListener("click", generate);
    $("#password-copy-btn", root)?.addEventListener("click", () => copyText(output?.dataset.value || output?.textContent || ""));
    generate();
  }

  function setupRedirectCompat() {
    const path = location.pathname;
    const redirects = {
      "/mainmenu.html": "/",
      "/generator-nikov.html": "/generator/",
      "/generator-paroley.html": "/passwords/",
      "/steam-niki.html": "/steam/",
      "/roblox-niki.html": "/roblox/",
      "/minecraft-niki.html": "/minecraft/",
      "/valorant-niki.html": "/valorant/",
      "/twitch-niki.html": "/twitch/",
      "/about.html": "/about/",
      "/privacy.html": "/privacy/"
    };
    if (redirects[path]) location.replace(redirects[path] + location.search + location.hash);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    setupNavigation();
    setupGenerator();
    setupPasswordGenerator();
    renderFavorites();
    setupRedirectCompat();
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  });
})();