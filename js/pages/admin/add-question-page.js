// add-question-page.js
// শুধু admin (isAdmin: true) ইউজার এই পেজ থেকে প্রশ্ন যোগ করতে পারবে।
// Firestore rules-ও এটা নিশ্চিত করে — এই পেজের চেক শুধু UX এর জন্য, আসল সিকিউরিটি rules-এ।

import { renderNavbar } from "../../components/navbar.js";
import { renderMobileNav } from "../../components/mobile-nav.js";
import { getUserProfile } from "../../services/user-service.js";
import { addQuestion } from "../../services/question-service.js";
import { auth } from "../../config/firebase-config.js";
import { navigateTo } from "../../router/router.js";
import { showToast } from "../../utils/toast.js";
import { CATEGORIES, getCategoryById } from "../../config/categories-config.js";

export async function renderAddQuestionPage(rootEl) {
  const uid = auth.currentUser?.uid;
  if (!uid) return navigateTo("/login");

  const profile = await getUserProfile(uid);
  if (!profile?.isAdmin) {
    rootEl.innerHTML = `<main class="admin-page"><p>এই পেজ শুধু অ্যাডমিনদের জন্য।</p></main>`;
    return;
  }

  rootEl.appendChild(await renderNavbar());
  rootEl.appendChild(renderMobileNav());

  const main = document.createElement("main");
  main.className = "admin-page";
  main.innerHTML = `
    <h2>নতুন প্রশ্ন যোগ করুন</h2>

    <form id="question-form" class="admin-form">
      <div class="field">
        <label for="q-category">ক্যাটাগরি</label>
        <select id="q-category" required>
          ${CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
        </select>
      </div>

      <div class="field">
        <label for="q-subject">বিষয়</label>
        <select id="q-subject" required></select>
      </div>

      <div class="field">
        <label for="q-text">প্রশ্ন</label>
        <textarea id="q-text" rows="2" placeholder="প্রশ্নটা লিখুন" required></textarea>
      </div>

      <div class="options-grid">
        <div class="field">
          <label for="q-opt-0">অপশন ১</label>
          <input type="text" id="q-opt-0" required />
        </div>
        <div class="field">
          <label for="q-opt-1">অপশন ২</label>
          <input type="text" id="q-opt-1" required />
        </div>
        <div class="field">
          <label for="q-opt-2">অপশন ৩</label>
          <input type="text" id="q-opt-2" required />
        </div>
        <div class="field">
          <label for="q-opt-3">অপশন ৪</label>
          <input type="text" id="q-opt-3" required />
        </div>
      </div>

      <div class="field">
        <label for="q-correct">সঠিক উত্তর</label>
        <select id="q-correct" required>
          <option value="0">অপশন ১</option>
          <option value="1">অপশন ২</option>
          <option value="2">অপশন ৩</option>
          <option value="3">অপশন ৪</option>
        </select>
      </div>

      <div class="field">
        <label for="q-marks">মার্ক</label>
        <input type="number" id="q-marks" value="1" min="1" required />
      </div>

      <button class="btn" type="submit" id="q-submit-btn">প্রশ্ন যোগ করুন</button>
    </form>

    <div id="recent-added" class="recent-added"></div>
  `;

  rootEl.appendChild(main);

  const categorySelect = main.querySelector("#q-category");
  populateSubjectOptions(main, categorySelect.value);
  categorySelect.addEventListener("change", () => populateSubjectOptions(main, categorySelect.value));

  main.querySelector("#question-form").addEventListener("submit", (e) => handleSubmit(e, main));
}

// নির্বাচিত ক্যাটাগরি অনুযায়ী "বিষয়" ড্রপডাউন রিফ্রেশ করা — ক্যাটাগরি বদলালেই কল হয়
function populateSubjectOptions(main, categoryId) {
  const category = getCategoryById(categoryId);
  const subjectSelect = main.querySelector("#q-subject");
  subjectSelect.innerHTML = (category?.subjects || [])
    .map((s) => `<option value="${s.id}">${s.name}</option>`)
    .join("");
}

async function handleSubmit(e, main) {
  e.preventDefault();
  const submitBtn = main.querySelector("#q-submit-btn");
  submitBtn.disabled = true;

  const questionData = {
    categoryId: main.querySelector("#q-category").value,
    subjectId: main.querySelector("#q-subject").value,
    question: main.querySelector("#q-text").value,
    options: [0, 1, 2, 3].map((i) => main.querySelector(`#q-opt-${i}`).value),
    correctAnswer: Number(main.querySelector("#q-correct").value),
    marks: Number(main.querySelector("#q-marks").value),
  };

  try {
    await addQuestion(questionData);
    showToast("প্রশ্ন যোগ হয়েছে", "info");
    logRecentlyAdded(main, questionData);
    main.querySelector("#question-form").reset();
  } catch (err) {
    showToast("ব্যর্থ হয়েছে: " + err.message, "error");
  } finally {
    submitBtn.disabled = false;
  }
}

// একই সেশনে একের পর এক প্রশ্ন যোগ করার সময় নিচে ছোট লিস্ট দেখানো — বারবার কনফার্ম করতে হয় না
function logRecentlyAdded(main, questionData) {
  const list = main.querySelector("#recent-added");
  const item = document.createElement("div");
  item.className = "recent-item";
  item.textContent = `✓ ${questionData.question}`;
  list.prepend(item);
}
