document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("project-page")) return;

  const body = document.querySelector(".page-body");
  const detailsHeading = Array.from(body?.querySelectorAll("h1, h2, h3") ?? []).find(
    (heading) => heading.textContent.trim() === "Project Details"
  );
  const details = detailsHeading?.nextElementSibling;

  if (!detailsHeading || !details || details.tagName !== "P") return;

  const summary = document.createElement("section");
  summary.className = "project-summary";
  summary.append(detailsHeading, details);

  const technologies = Array.from(document.querySelectorAll(".properties .selected-value"))
    .map((technology) => technology.textContent.trim())
    .filter(Boolean);
  if (technologies.length) {
    const stack = document.createElement("div");
    stack.className = "project-stack";
    stack.setAttribute("aria-label", "Core technologies");
    const label = document.createElement("span");
    label.className = "project-stack__label";
    label.textContent = "CORE STACK";
    const tags = document.createElement("div");
    tags.className = "project-stack__tags";
    technologies.forEach((technology) => {
      const tag = document.createElement("span");
      tag.textContent = technology;
      tags.append(tag);
    });
    stack.append(label, tags);
    summary.append(stack);
  }

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

  const repositorySources = Array.from(body.querySelectorAll(".source")).filter((source) =>
    /^https:\/\/github\.com\//i.test(source.textContent.trim())
  );
  if (repositorySources.length) {
    const repositories = document.createElement("section");
    repositories.className = "project-repositories";
    repositories.setAttribute("aria-label", "Project source code");
    repositorySources.forEach((repositorySource) => {
      const repositoryUrl = repositorySource.textContent.trim();
      const repositoryName = new URL(repositoryUrl).pathname.split("/").filter(Boolean).pop()
        ?.replace(/[-_]+/g, " ") ?? "repository";
      const repositoryLink = document.createElement("a");
      repositoryLink.className = "project-repository-link";
      repositoryLink.href = repositoryUrl;
      repositoryLink.target = "_blank";
      repositoryLink.rel = "noopener";
      repositoryLink.textContent = `View ${repositoryName} ↗`;
      repositoryLink.setAttribute("aria-label", `View ${repositoryName} source code on GitHub`);
      repositorySource.replaceChildren(repositoryLink);
      const repository = repositorySource.closest("figure") ?? repositorySource;
      repository.classList.add("project-repository");
      repositories.append(repository);
    });
    summary.append(repositories);
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
});
