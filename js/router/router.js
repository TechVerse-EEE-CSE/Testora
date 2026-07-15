// router.js
// শুধু URL hash দেখে সঠিক পেজ ফাংশন কল করা — পেজের ভেতরের লজিক এখানে নেই
// প্রতিটা রুট চেঞ্জেই auth guard চেক হয়, শুধু প্রথম লোডে না — এটাই আসল ফিক্স

import { auth } from "../config/firebase-config.js";

const routes = {};      // { "/login": { renderFn, requiresAuth } }
let rootEl = null;
let notFoundHandler = () => { rootEl.innerHTML = "<h2>পেজ পাওয়া যায়নি</h2>"; };

// options: { requiresAuth: boolean } — ডিফল্ট true, লগইন পেজে false দিতে হবে
export function registerRoute(path, renderFn, options = {}) {
  routes[path] = { renderFn, requiresAuth: options.requiresAuth !== false };
}

export function setNotFoundHandler(fn) {
  notFoundHandler = fn;
}

export function initRouter(containerEl) {
  rootEl = containerEl;
  window.addEventListener("hashchange", handleRouteChange);
  handleRouteChange();
}

export function navigateTo(path) {
  window.location.hash = path;
}

function handleRouteChange() {
  const hash = window.location.hash.replace("#", "") || "/login";
  const [path, param] = parseHash(hash);
  const route = routes[path];

  if (!route) {
    rootEl.innerHTML = "";
    notFoundHandler();
    return;
  }

  // প্রতিটা নেভিগেশনে auth চেক — hasInitialized-নির্ভর পুরনো লজিকের বদলে এটাই একমাত্র জায়গায় গার্ড
  if (route.requiresAuth && !auth.currentUser) {
    if (hash !== "/login") navigateTo("/login");
    return;
  }
  if (!route.requiresAuth && path === "/login" && auth.currentUser) {
    navigateTo("/dashboard");
    return;
  }

  rootEl.innerHTML = ""; // আগের পেজ ক্লিয়ার করা
  route.renderFn(rootEl, param);
}

// "/exam/abc123" কে ["/exam/:id", "abc123"] এ ভাঙা
function parseHash(hash) {
  const segments = hash.split("/").filter(Boolean);
  if (segments.length === 2) {
    return [`/${segments[0]}/:id`, segments[1]];
  }
  return [`/${segments.join("/")}`, null];
}
