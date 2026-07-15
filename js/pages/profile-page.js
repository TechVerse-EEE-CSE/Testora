// profile-page.js
// স্টুডেন্ট প্রোফাইল — নিজের তথ্য দেখা, নাম/ক্লাস/টার্গেট-পরীক্ষা এডিট করা, পাসওয়ার্ড বদলানো
// Google দিয়ে সাইন-ইন করা ইউজারদের জন্য পাসওয়ার্ড সেকশন লুকানো থাকে (তাদের পাসওয়ার্ড নেই)

import { renderNavbar } from "../components/navbar.js";
import { renderMobileNav } from "../components/mobile-nav.js";
import { getUserProfile, updateUserProfile } from "../services/user-service.js";
import { getUserResults } from "../services/result-service.js";
import { changePassword, isGoogleAccount, logout } from "../services/auth-service.js";
import { auth } from "../config/firebase-config.js";
import { navigateTo } from "../router/router.js";
import { showToast } from "../utils/toast.js";
import { CATEGORIES } from "../config/categories-config.js";
import { calculateAverageScore } from "../services/stats-service.js";

export async function renderProfilePage(rootEl) {
  const uid = auth.currentUser?.uid;
  if (!uid) return navigateTo("/login");

  rootEl.appendChild(await renderNavbar());
  rootEl.appendChild(renderMobileNav());

  const main = document.createElement("main");
  main.className = "profile-page";
  main.innerHTML = `<p>লোড হচ্ছে...</p>`;
  rootEl.appendChild(main);

  const [profile, results] = await Promise.all([getUserProfile(uid), getUserResults(uid)]);
  if (!profile) {
    main.innerHTML = `<p>প্রোফাইল পাওয়া যায়নি</p>`;
    return;
  }

  const initials = (profile.name || "শি").trim().slice(0, 1).toUpperCase();
  const avatar = profile.photoURL
    ? `<img src="${profile.photoURL}" alt="${profile.name}" class="profile-avatar-img" />`
    : `<span class="profile-avatar-fallback">${initials}</span>`;
  const avgScore = calculateAverageScore(results);
  const joined = profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString("bn-BD") : "—";
  const providerLabel = isGoogleAccount() ? "Google অ্যাকাউন্ট" : "ইমেইল/পাসওয়ার্ড অ্যাকাউন্ট";

  main.innerHTML = `
    <section class="profile-header-card">
      <div class="profile-avatar">${avatar}</div>
      <div class="profile-header-info">
        <h2>${profile.name || "শিক্ষার্থী"}</h2>
        <p class="profile-email">${profile.email || ""}</p>
        <span class="profile-provider-badge">${providerLabel}</span>
      </div>
    </section>

    <section class="profile-stats-row">
      <div class="stat-card"><span class="stat-value">${profile.totalMarks ?? 0}</span><span>মোট মার্ক</span></div>
      <div class="stat-card"><span class="stat-value">${profile.examsGiven ?? 0}</span><span>এক্সাম দিয়েছেন</span></div>
      <div class="stat-card"><span class="stat-value">${avgScore}</span><span>গড় স্কোর/এক্সাম</span></div>
      <div class="stat-card"><span class="stat-value">${joined}</span><span>যোগদান</span></div>
    </section>

    <section class="profile-settings-card">
      <h3>প্রোফাইল সেটিংস</h3>
      <form id="profile-form" class="admin-form">
        <div class="field">
          <label for="p-name">নাম</label>
          <input type="text" id="p-name" value="${escapeAttr(profile.name || "")}" required />
        </div>
        <div class="field">
          <label for="p-class">শ্রেণি / লেভেল</label>
          <input type="text" id="p-class" placeholder="যেমনঃ দশম শ্রেণি, HSC ২য় বর্ষ" value="${escapeAttr(profile.class || "")}" />
        </div>
        <div class="field">
          <label for="p-target">কোন পরীক্ষার প্রস্তুতি নিচ্ছেন?</label>
          <select id="p-target">
            <option value="">— নির্বাচন করুন —</option>
            ${CATEGORIES.map(
              (c) => `<option value="${c.id}" ${profile.targetCategory === c.id ? "selected" : ""}>${c.name}</option>`
            ).join("")}
          </select>
        </div>
        <button class="btn" type="submit" id="profile-save-btn">সেভ করুন</button>
      </form>
    </section>

    <section class="profile-settings-card" id="password-card">
      ${
        isGoogleAccount()
          ? `<h3>পাসওয়ার্ড</h3><p class="profile-note">আপনি Google দিয়ে সাইন-ইন করেছেন, তাই এখানে আলাদা পাসওয়ার্ড সেট করার প্রয়োজন নেই।</p>`
          : `<h3>পাসওয়ার্ড বদলান</h3>
            <form id="password-form" class="admin-form">
              <div class="field">
                <label for="p-current-pass">বর্তমান পাসওয়ার্ড</label>
                <input type="password" id="p-current-pass" required minlength="6" />
              </div>
              <div class="field">
                <label for="p-new-pass">নতুন পাসওয়ার্ড</label>
                <input type="password" id="p-new-pass" required minlength="6" />
              </div>
              <div class="field">
                <label for="p-confirm-pass">নতুন পাসওয়ার্ড আবার লিখুন</label>
                <input type="password" id="p-confirm-pass" required minlength="6" />
              </div>
              <button class="btn btn-outline" type="submit" id="password-save-btn">পাসওয়ার্ড বদলান</button>
            </form>`
      }
    </section>

    <button class="btn btn-outline profile-logout-btn" id="profile-logout-btn">লগআউট</button>
  `;

  main.querySelector("#profile-form").addEventListener("submit", (e) => handleProfileSave(e, uid, main));
  const passwordForm = main.querySelector("#password-form");
  if (passwordForm) passwordForm.addEventListener("submit", handlePasswordChange);
  main.querySelector("#profile-logout-btn").addEventListener("click", async () => {
    await logout();
    navigateTo("/login");
  });
}

async function handleProfileSave(e, uid, main) {
  e.preventDefault();
  const saveBtn = main.querySelector("#profile-save-btn");
  saveBtn.disabled = true;

  try {
    await updateUserProfile(uid, {
      name: main.querySelector("#p-name").value.trim(),
      class: main.querySelector("#p-class").value.trim(),
      targetCategory: main.querySelector("#p-target").value,
    });
    showToast("প্রোফাইল আপডেট হয়েছে", "info");
  } catch (err) {
    showToast("আপডেট ব্যর্থ: " + err.message, "error");
  } finally {
    saveBtn.disabled = false;
  }
}

async function handlePasswordChange(e) {
  e.preventDefault();
  const form = e.target;
  const saveBtn = form.querySelector("#password-save-btn");
  const current = form.querySelector("#p-current-pass").value;
  const next = form.querySelector("#p-new-pass").value;
  const confirm = form.querySelector("#p-confirm-pass").value;

  if (next !== confirm) {
    showToast("নতুন পাসওয়ার্ড দুইবার একই দিতে হবে", "error");
    return;
  }

  saveBtn.disabled = true;
  try {
    await changePassword(current, next);
    showToast("পাসওয়ার্ড বদলানো হয়েছে", "info");
    form.reset();
  } catch (err) {
    showToast("পাসওয়ার্ড বদলানো ব্যর্থ: " + err.message, "error");
  } finally {
    saveBtn.disabled = false;
  }
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}
