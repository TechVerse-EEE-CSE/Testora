// login-page.js
// একটাই কার্ড — উপরে ট্যাব দিয়ে লগইন/রেজিস্টার টগল, নিচে Google বাটন, আর "পাসওয়ার্ড ভুলে গেছেন" মোড
// তিনটা mode: "login" | "register" | "forgot" — কোনো সময়ই দুইটা ফর্ম একসাথে দেখানো হয় না

import { loginWithEmail, registerWithEmail, loginWithGoogle, sendResetEmail } from "../services/auth-service.js";
import { createUserProfile, ensureUserProfile } from "../services/user-service.js";
import { showToast } from "../utils/toast.js";
import { navigateTo } from "../router/router.js";

let mode = "login"; // "login" | "register" | "forgot"

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
          <div id="password-field" class="field">
            <label for="auth-password">পাসওয়ার্ড</label>
            <input type="password" id="auth-password" placeholder="••••••••" required minlength="6" />
          </div>

          <button type="button" id="forgot-link" class="forgot-link">পাসওয়ার্ড ভুলে গেছেন?</button>

          <button class="btn auth-submit" type="submit" id="auth-submit-btn">লগইন করুন</button>
        </form>

        <div id="forgot-note" class="forgot-note hidden">
          ইমেইল দিন — রিসেট লিংক পাঠানো হবে। <button type="button" id="back-to-login">লগইনে ফিরুন</button>
        </div>

        <div class="auth-divider"><span>অথবা</span></div>

        <div class="auth-google-wrap">
          <button type="button" id="google-btn" class="btn-google">
            <svg viewBox="0 0 48 48" width="18" height="18">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.9 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.5 34.7 26.9 36 24 36c-5.4 0-9.9-3.1-11.3-7.5l-6.6 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2.2-2.2 4.1-4.1 5.5l6.5 5.5C41 35.8 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
            </svg>
            Google দিয়ে চালিয়ে যান
          </button>
        </div>
      </div>
    </main>
  `;

  rootEl.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchMode(rootEl, tab.dataset.mode));
  });
  rootEl.querySelector("#auth-form").addEventListener("submit", handleSubmit);
  rootEl.querySelector("#google-btn").addEventListener("click", () => handleGoogleSignIn(rootEl));
  rootEl.querySelector("#forgot-link").addEventListener("click", () => switchMode(rootEl, "forgot"));
  rootEl.querySelector("#back-to-login").addEventListener("click", () => switchMode(rootEl, "login"));
}

function switchMode(rootEl, newMode) {
  mode = newMode;
  const isForgot = mode === "forgot";

  rootEl.querySelectorAll(".auth-tab").forEach((t) => t.classList.toggle("is-active", t.dataset.mode === mode));
  rootEl.querySelector(".auth-tabs").classList.toggle("hidden", isForgot);
  rootEl.querySelector("#name-field").classList.toggle("hidden", mode !== "register");
  rootEl.querySelector("#auth-name").required = mode === "register";
  rootEl.querySelector("#password-field").classList.toggle("hidden", isForgot);
  rootEl.querySelector("#auth-password").required = !isForgot;
  rootEl.querySelector("#forgot-link").classList.toggle("hidden", mode !== "login");
  rootEl.querySelector("#forgot-note").classList.toggle("hidden", !isForgot);
  rootEl.querySelector(".auth-divider").classList.toggle("hidden", isForgot);
  rootEl.querySelector(".auth-google-wrap").classList.toggle("hidden", isForgot);

  const submitBtn = rootEl.querySelector("#auth-submit-btn");
  submitBtn.textContent = mode === "login" ? "লগইন করুন" : mode === "register" ? "রেজিস্টার করুন" : "রিসেট লিংক পাঠান";
}

async function handleSubmit(e) {
  e.preventDefault();
  const email = document.querySelector("#auth-email").value;
  const submitBtn = document.querySelector("#auth-submit-btn");
  submitBtn.disabled = true;

  try {
    if (mode === "login") {
      const password = document.querySelector("#auth-password").value;
      await loginWithEmail(email, password);
      navigateTo("/dashboard");
    } else if (mode === "register") {
      const password = document.querySelector("#auth-password").value;
      const name = document.querySelector("#auth-name").value;
      const user = await registerWithEmail(email, password);
      await createUserProfile(user.uid, { name, email, authProvider: "email" });
      navigateTo("/dashboard");
    } else {
      await sendResetEmail(email);
      showToast("রিসেট লিংক ইমেইলে পাঠানো হয়েছে, ইনবক্স চেক করুন", "info");
    }
  } catch (err) {
    const prefix = mode === "login" ? "লগইন ব্যর্থ: " : mode === "register" ? "রেজিস্ট্রেশন ব্যর্থ: " : "রিসেট ব্যর্থ: ";
    showToast(prefix + err.message, "error");
  } finally {
    submitBtn.disabled = false;
  }
}

async function handleGoogleSignIn(rootEl) {
  const googleBtn = rootEl.querySelector("#google-btn");
  googleBtn.disabled = true;
  try {
    const user = await loginWithGoogle();
    await ensureUserProfile(user.uid, {
      name: user.displayName || "শিক্ষার্থী",
      email: user.email || "",
      photoURL: user.photoURL || "",
      authProvider: "google",
    });
    navigateTo("/dashboard");
  } catch (err) {
    showToast("Google সাইন-ইন ব্যর্থ: " + err.message, "error");
  } finally {
    googleBtn.disabled = false;
  }
}
