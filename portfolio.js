document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("project-page")) {
    enhanceHomePage();
    return;
  }

  const body = document.querySelector(".page-body");
  const detailsHeading = Array.from(body?.querySelectorAll("h1, h2, h3") ?? []).find(
    (heading) => heading.textContent.trim() === "Project Details"
  );
  const details = detailsHeading?.nextElementSibling;

  if (!detailsHeading || !details || details.tagName !== "P") return;

  const summary = document.createElement("section");
  summary.className = "project-summary";
  summary.append(detailsHeading, details);

  const liveHeading = Array.from(body.querySelectorAll("h1, h2, h3")).find(
    (heading) => /^(live (website|demo) link)$/i.test(heading.textContent.trim())
  );
  const liveLink = liveHeading?.nextElementSibling;
  if (liveHeading && liveLink?.tagName === "P") {
    liveHeading.remove();
    liveLink.classList.add("project-live-link");
    const link = liveLink.querySelector("a");
    if (link) {
      const isVideo = /youtube\.com|youtu\.be/i.test(link.href);
      link.setAttribute("aria-label", isVideo ? `Watch the ${link.textContent.trim()} YouTube demo` : `Visit the live ${link.textContent.trim()} website`);
      link.dataset.liveSite = isVideo ? "Watch YouTube demo ↗" : "Visit live site ↗";
    }
    summary.append(liveLink);
  }

  const expoHeading = Array.from(body.querySelectorAll("h1, h2, h3")).find(
    (heading) => heading.textContent.trim() === "Senior Design Expo Page"
  );
  const expoLink = expoHeading?.nextElementSibling;
  if (expoHeading && expoLink?.tagName === "P") {
    expoHeading.remove();
    expoLink.classList.add("project-expo-link");
    const link = expoLink.querySelector("a");
    if (link) {
      link.setAttribute("aria-label", "Visit the Senior Design Expo page");
      link.dataset.expoSite = "Senior Design Expo ↗";
    }
    summary.append(expoLink);
  }

  body.prepend(summary);

  const photoSources = document.body.dataset.projectPhotos?.split("|").filter(Boolean);
  if (photoSources?.length) {
    const photoSection = document.createElement("section");
    photoSection.className = "project-photos";
    const heading = document.createElement("h2");
    heading.textContent = "Project Photos";
    const gallery = document.createElement("div");
    gallery.className = "project-photo-grid";
    photoSources.forEach((photoSource, index) => {
      const link = document.createElement("a");
      link.href = photoSource;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", `Open project photo ${index + 1} at full size`);
      const image = document.createElement("img");
      image.src = photoSource;
      image.alt = `${document.title} project screenshot ${index + 1}`;
      image.loading = index === 0 ? "eager" : "lazy";
      link.append(image);
      gallery.append(link);
    });
    photoSection.append(heading, gallery);
    summary.after(photoSection);
  }

  document.querySelectorAll(".project-page .source").forEach((source) => {
    const repositoryUrl = source.textContent.trim();
    if (!/^https:\/\/github\.com\//i.test(repositoryUrl)) return;

    const link = document.createElement("a");
    link.className = "repo-link";
    link.href = repositoryUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "View the project repository on GitHub");
    link.innerHTML = '<span>View repository</span><span aria-hidden="true">↗</span>';
    source.replaceChildren(link);
  });
});

function enhanceHomePage() {
  const pageBody = document.querySelector(".page-body");
  const hero = pageBody?.querySelector(":scope > .column-list");
  if (!pageBody || !hero || pageBody.querySelector(".recruiter-snapshot")) return;

  const resumeLink = pageBody.querySelector('a[href$=".pdf"]');
  const linkedinLink = pageBody.querySelector('a[href*="linkedin.com"]');
  const snapshot = document.createElement("section");
  snapshot.className = "recruiter-snapshot";
  snapshot.setAttribute("aria-labelledby", "recruiter-snapshot-title");
  snapshot.innerHTML = `
    <div class="recruiter-snapshot-intro">
      <p class="recruiter-eyebrow">RECRUITER SNAPSHOT</p>
      <h2 id="recruiter-snapshot-title">A product-minded engineer who can build across the stack.</h2>
    </div>
    <div class="recruiter-points">
      <article><span>01</span><h3>Mobile + web</h3><p>Builds polished iOS, Android, and web experiences.</p></article>
      <article><span>02</span><h3>End-to-end delivery</h3><p>Connects thoughtful interfaces to APIs, data, and deployment.</p></article>
      <article><span>03</span><h3>Collaborative systems</h3><p>Contributes confidently across teams, platforms, and codebases.</p></article>
    </div>
    <div class="recruiter-actions"></div>
  `;

  const actions = snapshot.querySelector(".recruiter-actions");
  if (resumeLink) {
    const resume = resumeLink.cloneNode(true);
    resume.className = "recruiter-action recruiter-action-primary";
    resume.target = "_blank";
    resume.rel = "noopener";
    resume.textContent = "View résumé ↗";
    actions.append(resume);
  }
  if (linkedinLink) {
    const linkedin = linkedinLink.cloneNode(true);
    linkedin.className = "recruiter-action recruiter-action-secondary";
    linkedin.target = "_blank";
    linkedin.rel = "noopener";
    linkedin.textContent = "Connect on LinkedIn ↗";
    actions.append(linkedin);
  }

  if (!actions.children.length) actions.remove();
  hero.after(snapshot);
}
