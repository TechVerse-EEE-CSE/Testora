# Testora — প্রজেক্ট স্ট্রাকচার

## ফোল্ডার বিন্যাস ও নিয়ম

```
js/config/    → শুধু সেটিংস/কনস্ট্যান্ট, কোনো লজিক না
js/utils/     → খাঁটি ফাংশন, Firebase বা DOM-নির্ভর না (dom-utils বাদে)
js/services/  → শুধু Firebase/Firestore-এর সাথে কথা বলে, এক কালেকশন = এক ফাইল
js/pages/     → একটা HTML পেজ = একটা controller ফাইল, শুধু UI ইভেন্ট + service কল
css/          → variables.css এ টোকেন, বাকি ফাইলে actual স্টাইল
```

**নিয়ম:** service ফাইলগুলো কখনো DOM ছোঁবে না। page ফাইলগুলো কখনো সরাসরি Firestore কল করবে না — সবসময় service এর মাধ্যমে।

## এখন যা আছে
- Firebase config, constants, app config
- Auth, User, Question, Exam, Result, Leaderboard, Stats — সব কয়টা service
- time/dom/toast utils
- login.html + login-page.js (কাজ করার মতো উদাহরণ)

## পরের ধাপ (একই প্যাটার্নে বানাতে হবে)
1. `dashboard.html` + `dashboard-page.js` — subject list, exam list দেখাবে
2. `exam.html` + `exam-page.js` + `exam-engine.js` (util) — টাইমার, প্রশ্ন নেভিগেশন, সাবমিট
3. `result.html` + `result-page.js`
4. `leaderboard.html` + `leaderboard-page.js`
5. `stats.html` — আপনার AlQuran stats পেজের প্যাটার্ন অনুসরণ করে হিটম্যাপ/ব্যাজ
6. `admin/` ফোল্ডারে প্রশ্ন-আপলোড ও এক্সাম-শিডিউল পেজ
7. Firestore security rules + Cloud Function (correct answer client-এ না পাঠিয়ে সার্ভার-সাইড স্কোরিং)

## Firebase config বসানো
`js/config/firebase-config.js` ফাইলে আপনার Firebase কনসোলের config বসিয়ে দিন।
