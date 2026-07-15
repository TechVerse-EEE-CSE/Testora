// dashboard-page.js
// লগইন করা ইউজারের হোম পেজ — ধাপে ধাপে দেখায়:
// ধাপ ১: ক্যাটাগরি (এসএসসি/এইচএসসি/ভর্তি/বিসিএস)
// ধাপ ২: সেই ক্যাটাগরির সাবজেক্ট লিস্ট
// ধাপ ৩: সেই সাবজেক্টের এক্সাম লিস্ট (Firestore থেকে)
// প্রতিটা ধাপে ব্যাক বাটন + ব্রেডক্রাম্ব থাকে, DOM পুরোপুরি না রিলোড করেই ধাপ বদলায়

import { renderNavbar } from "../components/navbar.js";
import { renderMobileNav } from "../components/mobile-nav.js";
import { getUserProfile } from "../services/user-service.js";
import { getExamsBySubject } from "../services/exam-service.js";
import { auth } from "../config/firebase-config.js";
import { navigateTo } from "../router/router.js";
import { CATEGORIES } from "../config/categories-config.js";

export async function renderDashboardPage(rootEl) {
  rootEl.appendChild(await renderNavbar());
  rootEl.appendChild(renderMobileNav());

  const main = document.createElement("main");
  main.className = "dashboard-page";
  main.innerHTML = `<p>লোড হচ্ছে...</p>`;
  rootEl.appendChild(main);

  const uid = auth.currentUser?.uid;
  if (!uid) return navigateTo("/login");

  const profile = await getUserProfile(uid);

  main.innerHTML = `
    <section class="welcome-card">
      <h2>স্বাগতম, ${profile?.name || "শিক্ষার্থী"}</h2>
      <p>মোট মার্ক: ${profile?.totalMarks ?? 0} | এক্সাম দিয়েছেন: ${profile?.examsGiven ?? 0} টি</p>
    </section>

    <nav class="breadcrumb" id="dashboard-breadcrumb"></nav>
    <section class="subject-grid" id="dashboard-content"></section>
  `;

  renderCategoryStep(main);
}

// ধাপ ১ — ক্যাটাগরি বেছে নেওয়া
function renderCategoryStep(main) {
  renderBreadcrumb(main, [{ label: "ক্যাটাগরি বেছে নিন" }]);

  const content = main.querySelector("#dashboard-content");
  content.innerHTML = "";

  CATEGORIES.forEach((category) => {
    const card = document.createElement("div");
    card.className = "subject-card";
    card.innerHTML = `<h3>${category.name}</h3><p>${category.subjects.length} টি সাবজেক্ট</p>`;
    card.addEventListener("click", () => renderSubjectStep(main, category));
    content.appendChild(card);
  });
}

// ধাপ ২ — নির্বাচিত ক্যাটাগরির সাবজেক্ট লিস্ট
function renderSubjectStep(main, category) {
  renderBreadcrumb(main, [
    { label: "ক্যাটাগরি", onClick: () => renderCategoryStep(main) },
    { label: category.name },
  ]);

  const content = main.querySelector("#dashboard-content");
  content.innerHTML = "";

  category.subjects.forEach((subject) => {
    const card = document.createElement("div");
    card.className = "subject-card";
    card.innerHTML = `<h3>${subject.name}</h3><p>এক্সাম দেখতে ক্লিক করুন</p>`;
    card.addEventListener("click", () => renderExamStep(main, category, subject));
    content.appendChild(card);
  });
}

// ধাপ ৩ — নির্বাচিত সাবজেক্টের এক্সাম লিস্ট (Firestore)
async function renderExamStep(main, category, subject) {
  renderBreadcrumb(main, [
    { label: "ক্যাটাগরি", onClick: () => renderCategoryStep(main) },
    { label: category.name, onClick: () => renderSubjectStep(main, category) },
    { label: subject.name },
  ]);

  const content = main.querySelector("#dashboard-content");
  content.innerHTML = `<p>লোড হচ্ছে...</p>`;

  const exams = await getExamsBySubject(subject.id);

  content.innerHTML = "";
  const list = document.createElement("div");
  list.className = "exam-list";
  list.innerHTML = exams.length
    ? exams.map((ex) => `<div class="exam-item" data-id="${ex.id}">${ex.title}</div>`).join("")
    : `<p>এই সাবজেক্টে এখনো কোনো এক্সাম নেই</p>`;

  list.querySelectorAll(".exam-item").forEach((el) => {
    el.addEventListener("click", () => navigateTo(`/exam/${el.dataset.id}`));
  });

  content.appendChild(list);
}

// ব্রেডক্রাম্ব রেন্ডার — শেষেরটা ছাড়া বাকি সবগুলো ক্লিকযোগ্য (আগের ধাপে ফিরে যাওয়ার জন্য)
function renderBreadcrumb(main, steps) {
  const crumb = main.querySelector("#dashboard-breadcrumb");
  crumb.innerHTML = steps
    .map((step, i) => {
      const isLast = i === steps.length - 1;
      const separator = i > 0 ? `<span class="breadcrumb-sep">›</span>` : "";
      if (isLast || !step.onClick) {
        return `${separator}<span class="breadcrumb-item is-current">${step.label}</span>`;
      }
      return `${separator}<button type="button" class="breadcrumb-item breadcrumb-link" data-step="${i}">${step.label}</button>`;
    })
    .join("");

  crumb.querySelectorAll(".breadcrumb-link").forEach((btn) => {
    const step = steps[Number(btn.dataset.step)];
    btn.addEventListener("click", step.onClick);
  });
}
