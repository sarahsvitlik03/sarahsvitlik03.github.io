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

  const liveHeading = Array.from(body.querySelectorAll("h1, h2, h3")).find(
    (heading) => /^(live (website|demo) link)$/i.test(heading.textContent.trim())
  );
  const liveLink = liveHeading?.nextElementSibling;
  if (liveHeading && liveLink?.tagName === "P") {
    liveHeading.remove();
    liveLink.classList.add("project-live-link");
    const link = liveLink.querySelector("a");
    if (link) {
      link.setAttribute("aria-label", `Visit the live ${link.textContent.trim()} website`);
      link.dataset.liveSite = "Visit live site ↗";
    }
    summary.append(liveLink);
  }

  body.prepend(summary);
});
