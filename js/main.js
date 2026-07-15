// main.js
// এই ফাইলই একমাত্র জায়গা যেখানে সব রুট রেজিস্টার করা হয় ও অ্যাপ বুট হয়
// auth guard লজিক এখন router.js এর ভেতরে — প্রতিটা নেভিগেশনে চেক হয়, শুধু প্রথমবার না

import { initRouter, registerRoute } from "./router/router.js";
import { watchAuthState } from "./services/auth-service.js";

import { renderLoginPage } from "./pages/login-page.js";
import { renderDashboardPage } from "./pages/dashboard-page.js";
import { renderExamPage } from "./pages/exam-page.js";
import { renderResultPage } from "./pages/result-page.js";
import { renderLeaderboardPage } from "./pages/leaderboard-page.js";
import { renderStatsPage } from "./pages/stats-page.js";

registerRoute("/login", renderLoginPage, { requiresAuth: false });
registerRoute("/dashboard", renderDashboardPage);
registerRoute("/exam/:id", (root, id) => renderExamPage(root, id));
registerRoute("/result/:id", (root, id) => renderResultPage(root, id));
registerRoute("/leaderboard", renderLeaderboardPage);
registerRoute("/stats", renderStatsPage);

const appRoot = document.getElementById("app");

// Firebase auth স্টেট রেডি হওয়া পর্যন্ত অপেক্ষা করে তারপর রাউটার বুট করা —
// নাহলে auth.currentUser এখনো null থাকা অবস্থায় প্রথম রুট চেক ভুল ফলাফল দিতে পারে
let hasBooted = false;
watchAuthState(() => {
  if (hasBooted) return;
  hasBooted = true;
  initRouter(appRoot);
});
