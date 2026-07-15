// exam-engine.js
// শুধু স্কোর ক্যালকুলেশন লজিক — DOM বা Firebase কিছুই ছোঁবে না, তাই টেস্ট করা সহজ

import { APP_CONFIG } from "../config/app-config.js";

// answers = { questionId: selectedOptionIndex }
export function calculateScore(questions, answers) {
  let score = 0;
  const wrongAnswers = [];

  questions.forEach((q) => {
    const selected = answers[q.id];
    if (selected === undefined) return; // উত্তর দেয়নি

    if (selected === q.correctAnswer) {
      score += q.marks || 1;
    } else {
      wrongAnswers.push(q.id);
      if (APP_CONFIG.NEGATIVE_MARKING) {
        score -= (q.marks || 1) * APP_CONFIG.NEGATIVE_MARK_VALUE;
      }
    }
  });

  return { score: Math.max(0, score), wrongAnswers };
}

export function calculateTotalMarks(questions) {
  return questions.reduce((sum, q) => sum + (q.marks || 1), 0);
}
