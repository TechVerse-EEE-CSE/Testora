// exam-page.js
// এক্সাম চলাকালীন UI — টাইমার শুরু করা, প্রশ্ন রেন্ডার করা, উত্তর সংগ্রহ, সাবমিট হ্যান্ডল করা

import { getExamById } from "../services/exam-service.js";
import { getQuestionsByIds } from "../services/question-service.js";
import { saveResult } from "../services/result-service.js";
import { updateUserStatsAfterExam } from "../services/user-service.js";
import { calculateScore, calculateTotalMarks } from "../utils/exam-engine.js";
import { formatSecondsToTimer, getElapsedSeconds } from "../utils/time-utils.js";
import { auth } from "../config/firebase-config.js";
import { navigateTo } from "../router/router.js";
import { showToast } from "../utils/toast.js";

let timerInterval = null;
let userAnswers = {};
let currentExam = null;
let currentQuestions = [];
let startTime = null;
let isSubmitted = false; // টাইমার-আউট আর ম্যানুয়াল বাটন — দুটো একসাথে ট্রিগার হলেও যাতে একবারই সাবমিট হয়

export async function renderExamPage(rootEl, examId) {
  rootEl.innerHTML = `<p>এক্সাম লোড হচ্ছে...</p>`;

  currentExam = await getExamById(examId);
  if (!currentExam) {
    rootEl.innerHTML = `<p>এক্সাম পাওয়া যায়নি</p>`;
    return;
  }

  currentQuestions = await getQuestionsByIds(currentExam.questionIds || []);
  userAnswers = {};
  startTime = Date.now();
  isSubmitted = false;

  rootEl.innerHTML = `
    <main class="exam-page">
      <header class="exam-header">
        <h2>${currentExam.title}</h2>
        <span id="exam-timer" class="exam-timer"></span>
      </header>
      <div id="question-list" class="question-list"></div>
      <button id="submit-exam-btn" class="btn">জমা দিন</button>
    </main>
  `;

  renderQuestions(rootEl.querySelector("#question-list"));
  startTimer(rootEl.querySelector("#exam-timer"), (currentExam.durationMin || 30) * 60);
  rootEl.querySelector("#submit-exam-btn").addEventListener("click", submitExam);
}

function renderQuestions(container) {
  container.innerHTML = currentQuestions
    .map(
      (q, i) => `
      <div class="question-block" data-qid="${q.id}">
        <p class="question-text">${i + 1}. ${q.question}</p>
        ${q.options
          .map(
            (opt, idx) => `
            <label class="option-label">
              <input type="radio" name="q-${q.id}" value="${idx}" />
              ${opt}
            </label>`
          )
          .join("")}
      </div>`
    )
    .join("");

  container.querySelectorAll("input[type=radio]").forEach((input) => {
    input.addEventListener("change", (e) => {
      const qid = e.target.closest(".question-block").dataset.qid;
      userAnswers[qid] = Number(e.target.value);
    });
  });
}

function startTimer(timerEl, totalSeconds) {
  let remaining = totalSeconds;
  timerEl.textContent = formatSecondsToTimer(remaining);

  timerInterval = setInterval(() => {
    remaining--;
    timerEl.textContent = formatSecondsToTimer(remaining);
    if (remaining <= 0) {
      clearInterval(timerInterval);
      showToast("সময় শেষ! অটো-সাবমিট হচ্ছে।", "info");
      submitExam();
    }
  }, 1000);
}

async function submitExam() {
  if (isSubmitted) return; // ম্যানুয়াল ক্লিক আর টাইমআউট একসাথে ঘটলে দ্বিতীয়বার আটকানো
  isSubmitted = true;
  clearInterval(timerInterval);

  const submitBtn = document.getElementById("submit-exam-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "জমা হচ্ছে...";
  }

  const uid = auth.currentUser?.uid;
  const { score, wrongAnswers } = calculateScore(currentQuestions, userAnswers);
  const totalMarks = calculateTotalMarks(currentQuestions);
  const timeSpentSec = getElapsedSeconds(startTime, Date.now());

  const result = await saveResult({
    uid,
    examId: currentExam.id,
    subjectId: currentExam.subjectId,
    score,
    totalMarks,
    timeSpentSec,
    wrongAnswers,
    answeredAt: new Date().toISOString(),
  });

  await updateUserStatsAfterExam(uid, score, timeSpentSec);
  navigateTo(`/result/${result.id}`);
}
