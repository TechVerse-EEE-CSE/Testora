// login-page.js
// একটাই ফর্ম, উপরে ট্যাব দিয়ে লগইন/রেজিস্টার টগল হয় — দুইটা ফর্ম একসাথে দেখানো হয় না

import { loginWithEmail, registerWithEmail } from "../services/auth-service.js";
import { createUserProfile } from "../services/user-service.js";
import { showToast } from "../utils/toast.js";
import { navigateTo } from "../router/router.js";

let mode = "login"; // "login" | "register"

export function renderLoginPage(rootEl) {
  mode = "login";
  rootEl.innerHTML = `
    <main class="auth-page">
      <div class="auth-brand">
        <span class="auth-brand-mark">T</span>
        <h1 class="app-title">Testora</h1>
        <p class="app-tagline">তোমার প্রস্তুতি, তোমার ফলাফল — এক জায়গায়</p>
      </div>

      <div class="auth-card">
        <div class="auth-tabs">
          <button type="button" class="auth-tab is-active" data-mode="login">লগইন</button>
          <button type="button" class="auth-tab" data-mode="register">নতুন অ্যাকাউন্ট</button>
        </div>

        <form id="auth-form" class="auth-form">
          <div id="name-field" class="field hidden">
            <label for="auth-name">নাম</label>
            <input type="text" id="auth-name" placeholder="তোমার নাম" />
          </div>
          <div class="field">
            <label for="auth-email">ইমেইল</label>
            <input type="email" id="auth-email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label for="auth-password">পাসওয়ার্ড</label>
            <input type="password" id="auth-password" placeholder="••••••••" required minlength="6" />
          </div>
          <button class="btn auth-submit" type="submit" id="auth-submit-btn">লগইন করুন</button>
        </form>
      </div>
    </main>
  `;

  rootEl.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchMode(rootEl, tab.dataset.mode));
  });
  rootEl.querySelector("#auth-form").addEventListener("submit", handleSubmit);
}

function switchMode(rootEl, newMode) {
  mode = newMode;
  rootEl.querySelectorAll(".auth-tab").forEach((t) => t.classList.toggle("is-active", t.dataset.mode === mode));
  rootEl.querySelector("#name-field").classList.toggle("hidden", mode === "login");
  rootEl.querySelector("#auth-name").required = mode === "register";
  rootEl.querySelector("#auth-submit-btn").textContent = mode === "login" ? "লগইন করুন" : "রেজিস্টার করুন";
}

async function handleSubmit(e) {
  e.preventDefault();
  const email = document.querySelector("#auth-email").value;
  const password = document.querySelector("#auth-password").value;
  const submitBtn = document.querySelector("#auth-submit-btn");
  submitBtn.disabled = true;

  try {
    if (mode === "login") {
      await loginWithEmail(email, password);
    } else {
      const name = document.querySelector("#auth-name").value;
      const user = await registerWithEmail(email, password);
      await createUserProfile(user.uid, { name, email });
    }
    navigateTo("/dashboard");
  } catch (err) {
    showToast((mode === "login" ? "লগইন ব্যর্থ: " : "রেজিস্ট্রেশন ব্যর্থ: ") + err.message, "error");
    submitBtn.disabled = false;
  }
}
