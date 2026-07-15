// leaderboard-page.js
// গ্লোবাল টপ স্কোরার লিস্ট দেখানো

import { renderNavbar } from "../components/navbar.js";
import { renderMobileNav } from "../components/mobile-nav.js";
import { getGlobalLeaderboard } from "../services/leaderboard-service.js";
import { auth } from "../config/firebase-config.js";

export async function renderLeaderboardPage(rootEl) {
  rootEl.appendChild(renderNavbar());
  rootEl.appendChild(renderMobileNav());

  const main = document.createElement("main");
  main.className = "leaderboard-page";
  main.innerHTML = `<p>লোড হচ্ছে...</p>`;
  rootEl.appendChild(main);

  const leaders = await getGlobalLeaderboard();
  const myUid = auth.currentUser?.uid;

  main.innerHTML = `
    <h2>লিডারবোর্ড</h2>
    <div class="leaderboard-list">
      ${leaders
        .map(
          (l) => `
        <div class="leaderboard-row ${l.uid === myUid ? "is-me" : ""}">
          <span class="rank">#${l.rank}</span>
          <span class="name">${l.name}</span>
          <span class="marks">${l.totalMarks} মার্ক</span>
        </div>`
        )
        .join("")}
    </div>
  `;
}
