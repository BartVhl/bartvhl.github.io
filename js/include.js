function getBasePath() {
  const depth = location.pathname.split("/").filter(Boolean).length - 1;
  return depth <= 0 ? "" : "../".repeat(depth);
}

async function includePartials() {
  const base = getBasePath();

  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(
    Array.from(nodes).map(async (node) => {
      const file = node.getAttribute("data-include");
      const res = await fetch(`${base}${file}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${file}`);

      let html = await res.text();
      html = html.replaceAll("{{BASE}}", base);

      node.outerHTML = html;
    })
  );
}

function markActiveLink() {
  const path = location.pathname.replace(/\/+$/, "");
  document.querySelectorAll(".nav-list a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const abs = new URL(href, location.href).pathname.replace(/\/+$/, "");
    if (abs === path) a.setAttribute("aria-current", "page");
  });
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await includePartials();
    markActiveLink();
  } catch (e) {
    console.error(e);
  }
});

