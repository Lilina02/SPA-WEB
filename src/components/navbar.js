import { isUserLoggedIn, logoutUser } from "../api/auth.js";

export function getNavLinks() {
  const baseLinks = [
    { href: "#/", text: "Beranda" },
    { href: "#/add", text: "Tambah Cerita" },
  ];

  const authLinks = isUserLoggedIn()
    ? [{ href: "#/logout", text: "Keluar" }]
    : [
        { href: "#/login", text: "Masuk" },
        { href: "#/register", text: "Daftar" },
      ];

  return [...baseLinks, ...authLinks];
}

function createNav(links) {
  const nav = document.createElement("nav");
  nav.id = "main-nav";
  nav.classList.add("nav", "gap-3");
  nav.setAttribute("aria-label", "Navigasi utama");

  const currentHash = window.location.hash || "#/";

  links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.text;
    a.setAttribute("role", "link");
    a.classList.add("nav-link");

    // Tambahkan class 'active' jika hash cocok
    if (link.href === currentHash) {
      a.classList.add("active");
    }

    nav.appendChild(a);
  });

  return nav;
}

export function renderNav() {
  const navContainer = document.getElementById("main-nav");
  const parent =
    navContainer?.parentElement || document.querySelector("header .container");

  const oldNav = document.getElementById("main-nav");
  const newNav = createNav(getNavLinks());

  if (oldNav) {
    parent.replaceChild(newNav, oldNav);
  } else {
    parent.appendChild(newNav);
  }
}

export function setupLogoutHandler() {
  document.body.addEventListener("click", (e) => {
    const logoutLink = e.target.closest('a[href="#/logout"]');
    if (logoutLink) {
      e.preventDefault();
      logoutUser();
      renderNav();
      window.location.hash = "#/login";
    }
  });
}

window.addEventListener("hashchange", renderNav); // Update nav saat berpindah halaman

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  setupLogoutHandler();
});
