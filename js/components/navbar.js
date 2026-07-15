// navbar.js
// শুধু ন্যাভিগেশন বার তৈরি ও লগআউট বাটনের কাজ — নিজে কোনো রুট লজিক জানে না
// isAdmin হলে একটা এক্সট্রা "প্রশ্ন যোগ" লিংক দেখায়, তাই এটা এখন async

import { logout } from "../services/auth-service.js";
import { getUserProfile } from "../services/user-service.js";
import { navigateTo } from "../router/router.js";
import { auth } from "../config/firebase-config.js";

export async function renderNavbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const uid = auth.currentUser?.uid;
  const profile = uid ? await getUserProfile(uid) : null;
  const adminLink = profile?.isAdmin
    ? `<a href="#/admin/questions">প্রশ্ন যোগ</a>`
    : "";

  nav.innerHTML = `
    <span class="navbar-logo">Testora</span>
    <div class="navbar-links">
      <a href="#/dashboard">ড্যাশবোর্ড</a>
      <a href="#/leaderboard">লিডারবোর্ড</a>
      <a href="#/stats">পরিসংখ্যান</a>
      <a href="#/profile">প্রোফাইল</a>
      ${adminLink}
      <button id="logout-btn" class="btn btn-outline">লগআউট</button>
    </div>
  `;

  nav.querySelector("#logout-btn").addEventListener("click", async () => {
    await logout();
    navigateTo("/login");
  });

  return nav;
}
