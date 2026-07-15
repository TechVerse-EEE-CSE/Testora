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
    admin/
      add-question-page.js → শুধু isAdmin ইউজারদের জন্য, ফর্ম দিয়ে প্রশ্ন যোগ করে

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
- `users` — যে কেউ লগইন থাকলে পড়তে পারবে (লিডারবোর্ডের জন্য দরকার), শুধু নিজের ডকুমেন্ট লিখতে পারবে, আর `isAdmin` ফিল্ড ক্লায়েন্ট থেকে কখনো বদলানো যাবে না
- `subjects` / `exams` / `questions` — লগইন করা সবাই পড়তে পারবে, লেখা শুধু `isAdmin: true` থাকা ইউজার পারবে (Firestore rules নিজে `get()` দিয়ে ইউজারের প্রোফাইল চেক করে)
- `results` — নিজের রেজাল্ট ছাড়া কারো read/write অনুমতি নেই, update/delete একদমই বন্ধ
- `leaderboard` — read সবার জন্য খোলা, write বন্ধ (এখনো কোডে ব্যবহৃত হচ্ছে না)

**⚠️ জানা সীমাবদ্ধতা (rules দিয়ে সমাধানযোগ্য না, কোড আর্কিটেকচার বদলাতে হবে):**
1. `questions` কালেকশনে `correctAnswer` ফিল্ড ক্লায়েন্টে read হয় — DevTools থেকে উত্তর দেখে ফেলা সম্ভব। সমাধান: correctAnswer আলাদা কালেকশনে রেখে callable Cloud Function দিয়ে সার্ভার-সাইড স্কোরিং।
2. `users.totalMarks/examsGiven/totalTimeSpentSec` এখন ক্লায়েন্ট থেকে সরাসরি বদলায় (`user-service.js`) — কেউ চাইলে মার্ক বাড়িয়ে ফেলতে পারবে। সমাধান: `results` কালেকশনে `onCreate` Cloud Function ট্রিগার বসিয়ে সার্ভার থেকে totalMarks আপডেট করা, তারপর rules থেকে এই ফিল্ডগুলোর ক্লায়েন্ট-write বন্ধ করে দেওয়া (`onlyUpdatingFields` হেল্পার rules ফাইলে রেডি করা আছে)।
3. `results` কালেকশনে `(uid, answeredAt)` দিয়ে composite query আছে (`result-service.js`) — Firestore প্রথমবার রান করলে কনসোলে একটা composite index তৈরির লিংক দেখাবে, সেটায় ক্লিক করে index বানিয়ে নিতে হবে।

---

## এই আপডেটে যা ফিক্স হলো
- **router.js** — আগে শুধু প্রথম পেজ-লোডে auth চেক হতো; এখন প্রতিটা `hashchange`-এ চেক হয়
- **router.js (বাগ ফিক্স)** — `/admin/questions`-এর মতো ২-সেগমেন্ট স্ট্যাটিক রুটকে ভুলভাবে `/admin/:id` ডাইনামিক প্যাটার্নে ধরে ফেলতো (id="questions" হয়ে যেত)। এখন আগে exact static match চেক হয়, তারপর dynamic প্যাটার্ন — `resolveRoute()` ফাংশনে
- **main.js** — ডুপ্লিকেট auth-redirect লজিক সরিয়ে router-এর guard-এর উপর নির্ভরশীল করা হয়েছে
- **result-page.js** — সরাসরি `getResultById()` দিয়ে একটাই ডকুমেন্ট আনে, নিজের রেজাল্ট না হলে দেখাবে না
- **exam-page.js** — ডাবল-সাবমিট বাগ ঠিক, `isSubmitted` ফ্ল্যাগ দিয়ে
- **firestore.rules** — নতুন যোগ + এখন `isAdmin()` চেক দিয়ে subjects/exams/questions write সুরক্ষিত
- **login-page.js** — দুই ফর্মের বদলে টগল-ট্যাব সিঙ্গেল ফর্ম
- **navbar.js** — এখন async, ইউজার admin হলে "প্রশ্ন যোগ" লিংক দেখায়
- **mobile-nav.js** — নতুন, মোবাইল বটম-ন্যাভ
- **subjects-config.js** — বিষয় লিস্ট আগে dashboard-page.js এ হার্ডকোড ছিল, এখন শেয়ার্ড কনফিগে (dashboard ও admin দুই জায়গায় ব্যবহার হয়)

---

## Admin প্যানেল — প্রশ্ন যোগ করবেন যেভাবে

### ধাপ ১ — নিজেকে admin বানান
1. অ্যাপে সাধারণভাবে রেজিস্টার/লগইন করুন
2. Firebase Console → Firestore Database → `users` কালেকশনে গিয়ে নিজের UID-এর ডকুমেন্ট খুঁজুন (Authentication ট্যাবে ইমেইল দিয়ে UID পাবেন)
3. সেই ডকুমেন্টে `isAdmin` ফিল্ড এডিট করে `true` (boolean) বসান
4. এটা ক্লায়েন্ট থেকে কখনো করা যাবে না (rules ব্লক করে) — শুধু Console থেকেই করতে হবে, ইচ্ছাকৃতভাবে

### ধাপ ২ — প্রশ্ন যোগ করুন
1. আবার লগইন করুন (রিফ্রেশ)
2. টপ-বার / মোবাইল হলে সরাসরি URL-এ `#/admin/questions` গিয়ে ফর্ম পূরণ করুন — বিষয়, প্রশ্ন, ৪টা অপশন, সঠিক উত্তর বেছে সাবমিট
3. একই সেশনে একের পর এক প্রশ্ন যোগ করা যাবে, নিচে ছোট লিস্টে যোগ হওয়া প্রশ্নগুলো দেখাবে

### বিকল্প — Firebase Console থেকে সরাসরি
Admin পেজ ছাড়াও `questions` কালেকশনে সরাসরি ডকুমেন্ট বানাতে পারেন:
```
subjectId: "bangla"          (string, subjects-config.js এর id এর সাথে মিলতে হবে)
question: "প্রশ্নটা এখানে"      (string)
options: ["ক", "খ", "গ", "ঘ"]   (array)
correctAnswer: 0              (number — options এর ইনডেক্স, 0 থেকে শুরু)
marks: 1                      (number)
```

### এক্সাম বানানো
প্রশ্ন যোগ হয়ে গেলে `exams` কালেকশনে একটা ডকুমেন্ট বানাতে হবে যেটা সেই প্রশ্নগুলোর ID রেফারেন্স করে:
```
subjectId: "bangla"
title: "বাংলা মডেল টেস্ট ১"
durationMin: 30
questionIds: ["<question doc id 1>", "<question doc id 2>", ...]
```
প্রশ্নের doc ID Firebase Console থেকে কপি করতে হবে (Admin পেজ এখনো exam-builder UI বানায়নি — এটা পরের ধাপে যোগ করা যেতে পারে)।

## পরের ধাপ
1. Firebase কনসোল থেকে config বসান `js/config/firebase-config.js` এ
2. `firestore.rules` কনসোলে পেস্ট করে ডিপ্লয় করুন
3. অ্যাডমিন প্যানেল: প্রশ্ন-আপলোড ও এক্সাম-শিডিউল পেজ (js/pages/admin/ এ)
4. Cloud Function দিয়ে সার্ভার-সাইড স্কোরিং ও totalMarks আপডেট (উপরের সীমাবদ্ধতা ১ ও ২ দেখুন)
5. `subjects` কালেকশন থেকে dynamic বিষয় লিস্ট আনা (এখন dashboard-page.js এ হার্ডকোড করা)
