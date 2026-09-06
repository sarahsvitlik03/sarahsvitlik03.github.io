document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("project-page")) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pageBody = document.querySelector(".page-body");
  const hero = pageBody?.querySelector(".column-list");
  const introCopy = hero?.querySelector(".column:last-child");
  const titleEl = document.querySelector(".page-title");
  if (!pageBody || !hero || !introCopy || !titleEl) return;

  const roles = [
    "software engineer",
    "iOS & Android developer",
    "full-stack builder",
    "user-centered product thinker",
  ];

  const sourceCode = `const sarah = {
  role: "Software Engineer",
  stack: ["Swift", "React", "Flask"]
};`;

  const originalTitle = titleEl.textContent.trim();
  const sparkleMatch = originalTitle.match(/\s*(💫)$/);
  const titleText = originalTitle.replace(/\s*💫\s*$/, "");
  const sparkle = sparkleMatch ? sparkleMatch[1] : "";
  titleEl.setAttribute("aria-label", originalTitle);
  titleEl.innerHTML = `
    <span class="title-ghost" aria-hidden="true">${originalTitle}</span>
    <span class="title-live">
      <span class="title-typed"></span><span class="hero-caret hero-caret--title" aria-hidden="true"></span><span class="title-sparkle" aria-hidden="true">${sparkle}</span>
    </span>
  `;

  const tagline = document.createElement("p");
  tagline.className = "hero-typewriter";
  tagline.innerHTML = `<span class="hero-typewriter__prefix">currently</span> <span class="hero-typewriter__text"></span><span class="hero-caret" aria-hidden="true"></span>`;
  introCopy.append(tagline);

  const terminal = document.createElement("section");
  terminal.className = "hero-terminal";
  terminal.setAttribute("aria-label", "Animated code sample introducing Sarah");
  terminal.innerHTML = `
    <div class="hero-terminal__bar">
      <span class="hero-terminal__dots" aria-hidden="true"></span>
      <span class="hero-terminal__file">sarah.ts</span>
      <span class="hero-terminal__status">compiling…</span>
    </div>
    <pre class="hero-terminal__body"><code class="hero-terminal__code"></code><span class="hero-caret hero-caret--code" aria-hidden="true"></span></pre>
  `;
  introCopy.append(terminal);

  const typedTitle = titleEl.querySelector(".title-typed");
  const titleCaret = titleEl.querySelector(".hero-caret--title");
  const sparkleEl = titleEl.querySelector(".title-sparkle");
  const typedRole = tagline.querySelector(".hero-typewriter__text");
  const codeEl = terminal.querySelector(".hero-terminal__code");
  const statusEl = terminal.querySelector(".hero-terminal__status");

  const aboutHeading = Array.from(pageBody.querySelectorAll("h1")).find((heading) =>
    /about me/i.test(heading.textContent)
  );
  const aboutCopy = aboutHeading?.nextElementSibling;
  if (aboutCopy?.tagName === "P") {
    aboutCopy.classList.add("about-preview");
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "about-toggle";
    toggle.textContent = "read more";
    toggle.addEventListener("click", () => {
      const open = aboutCopy.classList.toggle("is-open");
      toggle.textContent = open ? "show less" : "read more";
      toggle.setAttribute("aria-expanded", String(open));
    });
    toggle.setAttribute("aria-expanded", "false");
    aboutCopy.after(toggle);
  }

  const escapeHtml = (value) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const highlight = (value) =>
    escapeHtml(value)
      .replace(/"([^"]*)"/g, '<span class="tok-str">"$1"</span>')
      .replace(/\bconst\b/g, '<span class="tok-kw">const</span>')
      .replace(/\bsarah\b/g, '<span class="tok-id">sarah</span>')
      .replace(/\b([A-Za-z_]+)(?=:)/g, '<span class="tok-key">$1</span>');

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const typeText = async (el, text, speed = 42) => {
    el.textContent = "";
    for (let i = 0; i < text.length; i += 1) {
      el.textContent = text.slice(0, i + 1);
      await wait(speed);
    }
  };

  const deleteText = async (el, speed = 28) => {
    const text = el.textContent;
    for (let i = text.length; i >= 0; i -= 1) {
      el.textContent = text.slice(0, i);
      await wait(speed);
    }
  };

  const cycleRoles = async () => {
    let index = 0;
    while (true) {
      await typeText(typedRole, roles[index], 46);
      await wait(1600);
      await deleteText(typedRole, 24);
      await wait(220);
      index = (index + 1) % roles.length;
    }
  };

  const typeCode = async () => {
    for (let i = 0; i <= sourceCode.length; i += 1) {
      codeEl.innerHTML = highlight(sourceCode.slice(0, i));
      await wait(sourceCode[i] === "\n" ? 70 : 16);
    }
    statusEl.textContent = "ready";
    statusEl.classList.add("is-ready");
    terminal.classList.add("is-complete");
  };

  const typeTitle = async () => {
    await typeText(typedTitle, titleText, 52);
    titleCaret.classList.add("is-done");
    sparkleEl.classList.add("is-in");
  };

  if (reduceMotion) {
    typedTitle.textContent = titleText;
    titleCaret.classList.add("is-done");
    sparkleEl.classList.add("is-in");
    typedRole.textContent = roles[0];
    codeEl.innerHTML = highlight(sourceCode);
    statusEl.textContent = "ready";
    statusEl.classList.add("is-ready");
    terminal.classList.add("is-complete");
  } else {
    typeTitle().then(() => {
      cycleRoles();
      typeCode();
    });
  }

  const revealItems = pageBody.querySelectorAll("h1, p, .collection-content, .column-list, figure, hr");
  revealItems.forEach((item, index) => {
    item.classList.add("scroll-reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 40, 280)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
});
