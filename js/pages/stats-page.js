// stats-page.js
// ইউজারের প্রগ্রেস ও পরিসংখ্যান দেখানো

import { renderNavbar } from "../components/navbar.js";
import { renderMobileNav } from "../components/mobile-nav.js";
import { getUserResults } from "../services/result-service.js";
import {
  calculateAverageScore,
  calculateTotalTimeSpent,
  buildActivityMap,
  calculateStreak,
} from "../services/stats-service.js";
import { formatMinutesToReadable } from "../utils/time-utils.js";
import { auth } from "../config/firebase-config.js";
import { navigateTo } from "../router/router.js";

export async function renderStatsPage(rootEl) {
  rootEl.appendChild(renderNavbar());
  rootEl.appendChild(renderMobileNav());

  const main = document.createElement("main");
  main.className = "stats-page";
  main.innerHTML = `<p>লোড হচ্ছে...</p>`;
  rootEl.appendChild(main);

  const uid = auth.currentUser?.uid;
  if (!uid) return navigateTo("/login");

  const results = await getUserResults(uid);
  const avgScore = calculateAverageScore(results);
  const totalTimeSec = calculateTotalTimeSpent(results);
  const activityMap = buildActivityMap(results);
  const streak = calculateStreak(activityMap);

  main.innerHTML = `
    <h2>আপনার পরিসংখ্যান</h2>
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-value">${results.length}</span><span>মোট এক্সাম</span></div>
      <div class="stat-card"><span class="stat-value">${avgScore}</span><span>গড় স্কোর</span></div>
      <div class="stat-card"><span class="stat-value">${streak}</span><span>দিনের স্ট্রিক</span></div>
      <div class="stat-card"><span class="stat-value">${formatMinutesToReadable(Math.round(totalTimeSec / 60))}</span><span>মোট সময়</span></div>
    </div>
  `;
}
