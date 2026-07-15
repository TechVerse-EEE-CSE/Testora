// mobile-nav.js
// শুধু মোবাইল স্ক্রিনে দেখা যায় এমন নিচের নেভিগেশন বার — CSS media query ঠিক করে কখন দেখাবে

const NAV_ITEMS = [
  {
    path: "/dashboard",
    label: "হোম",
    icon: `<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`,
  },
  {
    path: "/leaderboard",
    label: "লিডারবোর্ড",
    icon: `<svg viewBox="0 0 24 24"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6a5 5 0 01-10 0V4z"/><path d="M5 6H3v2a4 4 0 004 4"/><path d="M19 6h2v2a4 4 0 01-4 4"/></svg>`,
  },
  {
    path: "/stats",
    label: "পরিসংখ্যান",
    icon: `<svg viewBox="0 0 24 24"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-6"/></svg>`,
  },
];

export function renderMobileNav() {
  const nav = document.createElement("nav");
  nav.className = "mobile-nav";

  const currentPath = window.location.hash.replace("#", "") || "/dashboard";

  nav.innerHTML = NAV_ITEMS.map(
    (item) => `
    <a href="#${item.path}" class="mobile-nav-item ${item.path === currentPath ? "is-active" : ""}">
      ${item.icon}
      <span>${item.label}</span>
    </a>`
  ).join("");

  return nav;
}
