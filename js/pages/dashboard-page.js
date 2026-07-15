// dashboard-page.js
// লগইন করা ইউজারের হোম পেজ — বিষয় লিস্ট ও প্রতিটার এক্সামগুলো দেখায়

import { renderNavbar } from "../components/navbar.js";
import { renderMobileNav } from "../components/mobile-nav.js";
import { getUserProfile } from "../services/user-service.js";
import { getExamsBySubject } from "../services/exam-service.js";
import { auth } from "../config/firebase-config.js";
import { navigateTo } from "../router/router.js";

// আপাতত হার্ডকোড করা বিষয় লিস্ট — পরে subjects কালেকশন থেকে আনা যাবে
const SUBJECTS = [
  { id: "bangla", name: "বাংলা" },
  { id: "english", name: "ইংরেজি" },
  { id: "math", name: "গণিত" },
  { id: "science", name: "বিজ্ঞান" },
];

export async function renderDashboardPage(rootEl) {
  rootEl.appendChild(renderNavbar());
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

    <section class="subject-grid" id="subject-grid"></section>
  `;

  const grid = main.querySelector("#subject-grid");
  SUBJECTS.forEach((subject) => {
    const card = document.createElement("div");
    card.className = "subject-card";
    card.innerHTML = `<h3>${subject.name}</h3><p>এক্সাম দেখতে ক্লিক করুন</p>`;
    card.addEventListener("click", () => showExamsForSubject(subject, grid));
    grid.appendChild(card);
  });
}

async function showExamsForSubject(subject, grid) {
  const exams = await getExamsBySubject(subject.id);
  const list = document.createElement("div");
  list.className = "exam-list";
  list.innerHTML = exams.length
    ? exams.map((ex) => `<div class="exam-item" data-id="${ex.id}">${ex.title}</div>`).join("")
    : `<p>এই বিষয়ে এখনো কোনো এক্সাম নেই</p>`;

  list.querySelectorAll(".exam-item").forEach((el) => {
    el.addEventListener("click", () => navigateTo(`/exam/${el.dataset.id}`));
  });

  grid.appendChild(list);
}
