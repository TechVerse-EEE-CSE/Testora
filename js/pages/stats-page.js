// stats-page.js
// ইউজারের প্রগ্রেস ও পরিসংখ্যান — সামারি কার্ড, সাবজেক্ট-ভিত্তিক শক্তি/দুর্বলতা, ৭ দিনের হিটম্যাপ, সাম্প্রতিক এক্সাম

import { renderNavbar } from "../components/navbar.js";
import { renderMobileNav } from "../components/mobile-nav.js";
import { getUserResults } from "../services/result-service.js";
import {
  calculateAverageScore,
  calculateTotalTimeSpent,
  buildActivityMap,
  calculateStreak,
  buildLast7Days,
  calculateSubjectBreakdown,
} from "../services/stats-service.js";
import { formatMinutesToReadable } from "../utils/time-utils.js";
import { auth } from "../config/firebase-config.js";
import { navigateTo } from "../router/router.js";
import { getSubjectById } from "../config/categories-config.js";

export async function renderStatsPage(rootEl) {
  rootEl.appendChild(await renderNavbar());
  rootEl.appendChild(renderMobileNav());

  const main = document.createElement("main");
  main.className = "stats-page";
  main.innerHTML = `<p>লোড হচ্ছে...</p>`;
  rootEl.appendChild(main);

  const uid = auth.currentUser?.uid;
  if (!uid) return navigateTo("/login");

  const results = await getUserResults(uid);

  if (results.length === 0) {
    main.innerHTML = `
      <h2>আপনার পরিসংখ্যান</h2>
      <p class="stats-empty">এখনো কোনো এক্সাম দেননি — প্রথম এক্সামটা দিন, তারপর এখানে আপনার প্রগ্রেস দেখতে পাবেন।</p>
    `;
    return;
  }

  const avgScore = calculateAverageScore(results);
  const totalTimeSec = calculateTotalTimeSpent(results);
  const activityMap = buildActivityMap(results);
  const streak = calculateStreak(activityMap);
  const last7Days = buildLast7Days(activityMap);
  const subjectBreakdown = calculateSubjectBreakdown(results);
  const recentResults = results.slice(0, 5);

  main.innerHTML = `
    <h2>আপনার পরিসংখ্যান</h2>

    <div class="stats-grid">
      <div class="stat-card"><span class="stat-value">${results.length}</span><span>মোট এক্সাম</span></div>
      <div class="stat-card"><span class="stat-value">${avgScore}</span><span>গড় স্কোর</span></div>
      <div class="stat-card"><span class="stat-value">${streak} 🔥</span><span>দিনের স্ট্রিক</span></div>
      <div class="stat-card"><span class="stat-value">${formatMinutesToReadable(Math.round(totalTimeSec / 60))}</span><span>মোট সময়</span></div>
    </div>

    <section class="stats-section">
      <h3>শেষ ৭ দিনের কার্যক্রম</h3>
      <div class="heatmap-row">
        ${last7Days
          .map((d) => {
            const intensity = d.count === 0 ? 0 : Math.min(d.count, 3);
            return `<div class="heatmap-cell" data-intensity="${intensity}" title="${d.count} টি এক্সাম">
              <span class="heatmap-count">${d.count || ""}</span>
              <span class="heatmap-label">${d.label}</span>
            </div>`;
          })
          .join("")}
      </div>
    </section>

    <section class="stats-section">
      <h3>সাবজেক্ট অনুযায়ী পারফরম্যান্স</h3>
      <div class="subject-breakdown">
        ${
          subjectBreakdown.length
            ? subjectBreakdown
                .map((s) => {
                  const subject = getSubjectById(s.subjectId);
                  const label = subject ? `${subject.name} (${subject.categoryName})` : s.subjectId;
                  const level = s.percentage >= 70 ? "strong" : s.percentage >= 40 ? "medium" : "weak";
                  return `
                  <div class="breakdown-row">
                    <div class="breakdown-label">
                      <span>${label}</span>
                      <span class="breakdown-percent">${s.percentage}%</span>
                    </div>
                    <div class="breakdown-track">
                      <div class="breakdown-fill breakdown-${level}" style="width:${s.percentage}%"></div>
                    </div>
                    <span class="breakdown-count">${s.examCount} টি এক্সাম</span>
                  </div>`;
                })
                .join("")
            : `<p class="stats-empty">এখনো কোনো ডাটা নেই</p>`
        }
      </div>
    </section>

    <section class="stats-section">
      <h3>সাম্প্রতিক এক্সাম</h3>
      <div class="recent-results-list">
        ${recentResults
          .map((r) => {
            const percentage = r.totalMarks > 0 ? Math.round((r.score / r.totalMarks) * 100) : 0;
            const subject = getSubjectById(r.subjectId);
            const date = r.answeredAt ? new Date(r.answeredAt).toLocaleDateString("bn-BD") : "";
            return `
            <div class="recent-result-row" data-id="${r.id}">
              <div>
                <p class="recent-result-subject">${subject ? subject.name : r.subjectId}</p>
                <p class="recent-result-date">${date}</p>
              </div>
              <span class="recent-result-score mono-numeral">${r.score}/${r.totalMarks} (${percentage}%)</span>
            </div>`;
          })
          .join("")}
      </div>
    </section>
  `;

  main.querySelectorAll(".recent-result-row").forEach((row) => {
    row.addEventListener("click", () => navigateTo(`/result/${row.dataset.id}`));
  });
}
