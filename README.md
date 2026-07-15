# Testora — SPA প্রজেক্ট স্ট্রাকচার

## নিয়ম
একটাই HTML ফাইল: `index.html`। বাকি সব "পেজ" JS ফাংশন, যেগুলো `#app` div-এর ভেতরে রেন্ডার হয়। নেভিগেশন হয় URL hash দিয়ে (যেমন `#/dashboard`, `#/exam/xyz123`)। প্রতিটা রুট পাল্টানোর সময় `router.js` নিজে থেকে auth চেক করে — লগইন ছাড়া protected পেজে ঢোকা যায় না।

## ফোল্ডার বিন্যাস

```
index.html            → একমাত্র HTML ফাইল, শুধু <div id="app"></div> + main.js লোড করে
firestore.rules        → Firestore সিকিউরিটি রুলস (নিচে বিস্তারিত)

js/
  main.js              → এন্ট্রি পয়েন্ট: সব রুট রেজিস্টার করে, auth রেডি হলে router বুট করে
  router/
    router.js           → hash পড়ে সঠিক পেজ রেন্ডার করে + প্রতিটা নেভিগেশনে auth guard চেক করে
  config/
    firebase-config.js  → Firebase init
    firestore-paths.js  → collection নামের constant
    app-config.js        → app-wide সেটিংস
  services/             → এক Firestore collection = এক ফাইল, DOM ছোঁয় না
    auth-service.js, user-service.js, question-service.js,
    exam-service.js, result-service.js, leaderboard-service.js, stats-service.js
  utils/                → খাঁটি হেল্পার ফাংশন
    time-utils.js, dom-utils.js, toast.js, exam-engine.js (স্কোরিং লজিক)
  components/
    navbar.js            → ডেস্কটপ টপ-বার (মোবাইলে লিংক লুকানো, শুধু লগআউট থাকে)
    mobile-nav.js         → মোবাইল বটম-ন্যাভ (৭২০px এর নিচে দেখা যায়, navbar.js এর বদলি না — দুটো একসাথে থাকে)
  pages/                 → এক রুট = এক render ফাংশন
    login-page.js, dashboard-page.js, exam-page.js,
    result-page.js, leaderboard-page.js, stats-page.js

css/
  variables.css          → ডিজাইন টোকেন (রং/ফন্ট/স্পেসিং) — এক্সাম-শিট/অ্যাডমিট-কার্ড থিম
  global.css             → বেস রিসেট + বাকি সব css ইমপোর্ট করে (একমাত্র লিংক index.html এ)
  navbar.css, mobile-nav.css, auth.css, dashboard.css, exam.css,
  result.css, leaderboard.css, stats.css  → এক পেজ/কম্পোনেন্ট = এক CSS ফাইল
```

## ডিজাইন সিস্টেম
- **রং:** গভীর নেভি ব্যাকগ্রাউন্ড (#10121b) + অ্যাম্বার হাইলাইটার অ্যাকসেন্ট (#f2b84b)
- **ফন্ট:** হেডিং-এ Tiro Bangla (সেরিফ), বডি-তে Hind Siliguri, স্কোর/টাইমার/মার্কে JetBrains Mono (স্কোরবোর্ডের ভাইব)
- **সিগনেচার এলিমেন্ট:** এক্সাম পেজে OMR-শিটের বাবল-স্টাইল রেডিও বাটন, রেজাল্ট/স্ট্যাটস কার্ডে অ্যাডমিট-কার্ড/টিকিটের পারফোরেটেড ড্যাশড বর্ডার
- **লগইন/রেজিস্টার:** একটাই কার্ড, উপরে ট্যাব দিয়ে টগল হয় — দুইটা ফর্ম একসাথে দেখানো হয় না (`login-page.js`)
- **নেভিগেশন:** ডেস্কটপে টপ-বার (`navbar.js`), ৭২০px এর নিচে বটম আইকন-বার (`mobile-nav.js`) — দুটোই একসাথে রেন্ডার হয়, CSS media query ঠিক করে কোনটা কখন দেখা যাবে

## রুট লিস্ট (main.js এ রেজিস্টার করা)
- `#/login` → renderLoginPage (requiresAuth: false)
- `#/dashboard` → renderDashboardPage
- `#/exam/:id` → renderExamPage
- `#/result/:id` → renderResultPage
- `#/leaderboard` → renderLeaderboardPage
- `#/stats` → renderStatsPage

সব রুট ডিফল্টভাবে `requiresAuth: true` — লগইন ছাড়া গেলে router নিজেই `/login` এ পাঠিয়ে দেবে।

## নতুন পেজ যোগ করতে হলে
1. `js/pages/xyz-page.js` এ `export function renderXyzPage(rootEl, param) {...}` লিখুন
2. `css/xyz.css` বানিয়ে `global.css` তে `@import` করুন
3. `main.js` তে `registerRoute("/xyz", renderXyzPage)` যোগ করুন (পাবলিক পেজ হলে `{ requiresAuth: false }`)

---

## Firestore Security Rules
`firestore.rules` ফাইলে আছে। Firebase কনসোল → Firestore Database → Rules ট্যাবে গিয়ে এটা পেস্ট করুন, অথবা Firebase CLI থাকলে:
```
firebase deploy --only firestore:rules
```

**নিয়মের সারমর্ম:**
- `users` — যে কেউ লগইন থাকলে পড়তে পারবে (লিডারবোর্ডের জন্য দরকার), শুধু নিজের ডকুমেন্ট লিখতে পারবে
- `subjects` / `exams` / `questions` — লগইন করা সবাই পড়তে পারবে, লেখা শুধু Admin SDK/কনসোল থেকে
- `results` — নিজের রেজাল্ট ছাড়া কারো read/write অনুমতি নেই, update/delete একদমই বন্ধ
- `leaderboard` — read সবার জন্য খোলা, write বন্ধ (এখনো কোডে ব্যবহৃত হচ্ছে না)

**⚠️ জানা সীমাবদ্ধতা (rules দিয়ে সমাধানযোগ্য না, কোড আর্কিটেকচার বদলাতে হবে):**
1. `questions` কালেকশনে `correctAnswer` ফিল্ড ক্লায়েন্টে read হয় — DevTools থেকে উত্তর দেখে ফেলা সম্ভব। সমাধান: correctAnswer আলাদা কালেকশনে রেখে callable Cloud Function দিয়ে সার্ভার-সাইড স্কোরিং।
2. `users.totalMarks/examsGiven/totalTimeSpentSec` এখন ক্লায়েন্ট থেকে সরাসরি বদলায় (`user-service.js`) — কেউ চাইলে মার্ক বাড়িয়ে ফেলতে পারবে। সমাধান: `results` কালেকশনে `onCreate` Cloud Function ট্রিগার বসিয়ে সার্ভার থেকে totalMarks আপডেট করা, তারপর rules থেকে এই ফিল্ডগুলোর ক্লায়েন্ট-write বন্ধ করে দেওয়া (`onlyUpdatingFields` হেল্পার rules ফাইলে রেডি করা আছে)।
3. `results` কালেকশনে `(uid, answeredAt)` দিয়ে composite query আছে (`result-service.js`) — Firestore প্রথমবার রান করলে কনসোলে একটা composite index তৈরির লিংক দেখাবে, সেটায় ক্লিক করে index বানিয়ে নিতে হবে।

---

## এই আপডেটে যা ফিক্স হলো
- **router.js** — আগে শুধু প্রথম পেজ-লোডে auth চেক হতো; এখন প্রতিটা `hashchange`-এ চেক হয়, তাই লগআউট অবস্থায় সরাসরি হ্যাশ বদলে protected পেজে ঢোকা যাবে না
- **main.js** — ডুপ্লিকেট auth-redirect লজিক সরিয়ে router-এর guard-এর উপর নির্ভরশীল করা হয়েছে
- **result-page.js** — আগে ইউজারের সব রেজাল্ট ফেচ করে খুঁজতো; এখন সরাসরি `getResultById()` দিয়ে একটাই ডকুমেন্ট আনে, আর নিজের রেজাল্ট না হলে দেখাবে না
- **exam-page.js** — টাইমার-আউট আর ম্যানুয়াল সাবমিট বাটন একসাথে ট্রিগার হলে ডাবল-সাবমিট হওয়ার বাগ ছিল, `isSubmitted` ফ্ল্যাগ দিয়ে ঠিক করা হয়েছে, বাটনও ডিসেবল হয়ে যায় সাবমিটের সময়
- **firestore.rules** — আগে ছিলই না, এখন যোগ করা হয়েছে

## পরের ধাপ
1. Firebase কনসোল থেকে config বসান `js/config/firebase-config.js` এ
2. `firestore.rules` কনসোলে পেস্ট করে ডিপ্লয় করুন
3. অ্যাডমিন প্যানেল: প্রশ্ন-আপলোড ও এক্সাম-শিডিউল পেজ (js/pages/admin/ এ)
4. Cloud Function দিয়ে সার্ভার-সাইড স্কোরিং ও totalMarks আপডেট (উপরের সীমাবদ্ধতা ১ ও ২ দেখুন)
5. `subjects` কালেকশন থেকে dynamic বিষয় লিস্ট আনা (এখন dashboard-page.js এ হার্ডকোড করা)
