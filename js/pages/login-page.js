// login-page.js
// এই ফাংশন কল হলে rootEl-এর ভেতরে লগইন/রেজিস্টার ফর্ম বসিয়ে দেয়

import { loginWithEmail, registerWithEmail } from "../services/auth-service.js";
import { createUserProfile } from "../services/user-service.js";
import { showToast } from "../utils/toast.js";
import { navigateTo } from "../router/router.js";

export function renderLoginPage(rootEl) {
  rootEl.innerHTML = `
    <main class="auth-page">
      <h1 class="app-title">Testora</h1>

      <form id="login-form" class="auth-form">
        <h2>লগইন</h2>
        <input type="email" id="login-email" placeholder="ইমেইল" required />
        <input type="password" id="login-password" placeholder="পাসওয়ার্ড" required />
        <button class="btn" type="submit">লগইন করুন</button>
      </form>

      <form id="register-form" class="auth-form">
        <h2>নতুন অ্যাকাউন্ট</h2>
        <input type="text" id="register-name" placeholder="নাম" required />
        <input type="email" id="register-email" placeholder="ইমেইল" required />
        <input type="password" id="register-password" placeholder="পাসওয়ার্ড" required />
        <button class="btn" type="submit">রেজিস্টার করুন</button>
      </form>
    </main>
  `;

  rootEl.querySelector("#login-form").addEventListener("submit", handleLogin);
  rootEl.querySelector("#register-form").addEventListener("submit", handleRegister);
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;
  try {
    await loginWithEmail(email, password);
    navigateTo("/dashboard");
  } catch (err) {
    showToast("লগইন ব্যর্থ: " + err.message, "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.querySelector("#register-name").value;
  const email = document.querySelector("#register-email").value;
  const password = document.querySelector("#register-password").value;
  try {
    const user = await registerWithEmail(email, password);
    await createUserProfile(user.uid, { name, email });
    navigateTo("/dashboard");
  } catch (err) {
    showToast("রেজিস্ট্রেশন ব্যর্থ: " + err.message, "error");
  }
}
