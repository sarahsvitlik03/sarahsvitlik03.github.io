document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("project-page")) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pageBody = document.querySelector(".page-body");
  const hero = pageBody?.querySelector(".column-list");
  const introCopy = hero?.querySelector(".column:last-child");
  if (!pageBody || !hero || !introCopy) return;

  const roles = [
    "software engineer",
    "iOS & Android developer",
    "full-stack builder",
    "user-centered product thinker",
  ];

  const sourceCode = `const sarah = {
  role: "Software Engineer",
  location: "Waterbury, CT",
  experience: "4+ years",
  stack: ["Swift", "Kotlin", "React", "Flask"],
  focus: "clean architecture + thoughtful UX"
};`;

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
  hero.after(terminal);

  const typedRole = tagline.querySelector(".hero-typewriter__text");
  const codeEl = terminal.querySelector(".hero-terminal__code");
  const statusEl = terminal.querySelector(".hero-terminal__status");

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
      await wait(sourceCode[i] === "\n" ? 90 : 18);
    }
    statusEl.textContent = "ready";
    statusEl.classList.add("is-ready");
    terminal.classList.add("is-complete");
  };

  if (reduceMotion) {
    typedRole.textContent = roles[0];
    codeEl.innerHTML = highlight(sourceCode);
    statusEl.textContent = "ready";
    statusEl.classList.add("is-ready");
    terminal.classList.add("is-complete");
  } else {
    cycleRoles();
    typeCode();
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
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
});
