// navbar.js
// শুধু ন্যাভিগেশন বার তৈরি ও লগআউট বাটনের কাজ — নিজে কোনো রুট লজিক জানে না

import { logout } from "../services/auth-service.js";
import { navigateTo } from "../router/router.js";

export function renderNavbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <span class="navbar-logo">Testora</span>
    <div class="navbar-links">
      <a href="#/dashboard">ড্যাশবোর্ড</a>
      <a href="#/leaderboard">লিডারবোর্ড</a>
      <a href="#/stats">পরিসংখ্যান</a>
      <button id="logout-btn" class="btn btn-outline">লগআউট</button>
    </div>
  `;

  nav.querySelector("#logout-btn").addEventListener("click", async () => {
    await logout();
    navigateTo("/login");
  });

  return nav;
}
