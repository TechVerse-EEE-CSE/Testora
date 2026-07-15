// result-page.js
// একটা নির্দিষ্ট রেজাল্ট দেখানোর পেজ

import { renderNavbar } from "../components/navbar.js";
import { renderMobileNav } from "../components/mobile-nav.js";
import { getResultById } from "../services/result-service.js";
import { formatMinutesToReadable } from "../utils/time-utils.js";
import { auth } from "../config/firebase-config.js";
import { navigateTo } from "../router/router.js";

export async function renderResultPage(rootEl, resultId) {
  rootEl.appendChild(await renderNavbar());
  rootEl.appendChild(renderMobileNav());

  const main = document.createElement("main");
  main.className = "result-page";
  main.innerHTML = `<p>লোড হচ্ছে...</p>`;
  rootEl.appendChild(main);

  const uid = auth.currentUser?.uid;
  if (!uid) return navigateTo("/login");

  const result = await getResultById(resultId);

  // নিজের রেজাল্ট না হলে দেখানো যাবে না — অন্যের রেজাল্ট ID দিয়ে uid বদলে দেখতে না পারে
  if (!result || result.uid !== uid) {
    main.innerHTML = `<p>রেজাল্ট পাওয়া যায়নি</p>`;
    return;
  }

  const percentage = Math.round((result.score / result.totalMarks) * 100);

  main.innerHTML = `
    <section class="result-card">
      <h2>আপনার ফলাফল</h2>
      <p class="result-score">${result.score} / ${result.totalMarks}</p>
      <p>শতকরা: ${percentage}%</p>
      <p>ভুল উত্তর: ${result.wrongAnswers.length} টি</p>
      <p>সময় ব্যয়: ${formatMinutesToReadable(Math.round(result.timeSpentSec / 60))}</p>
      <button class="btn" id="back-to-dashboard">ড্যাশবোর্ডে ফিরুন</button>
    </section>
  `;

  main.querySelector("#back-to-dashboard").addEventListener("click", () => navigateTo("/dashboard"));
}
