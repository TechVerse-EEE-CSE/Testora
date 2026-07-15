// stats-service.js
// results ডাটা থেকে প্রগ্রেস/স্ট্যাটস ক্যালকুলেট করা — কোনো Firestore write নেই এখানে, শুধু ক্যালকুলেশন

export function calculateAverageScore(results) {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.score, 0);
  return Math.round((total / results.length) * 100) / 100;
}

export function calculateTotalTimeSpent(results) {
  return results.reduce((sum, r) => sum + (r.timeSpentSec || 0), 0);
}

// শেষ ৭ দিনের এক্টিভিটি (হিটম্যাপের জন্য) — { "2026-07-14": examCount }
export function buildActivityMap(results) {
  const map = {};
  results.forEach((r) => {
    const date = r.answeredAt?.split("T")[0];
    if (!date) return;
    map[date] = (map[date] || 0) + 1;
  });
  return map;
}

// পরপর কয়দিন এক্সাম দিয়েছে (স্ট্রিক)
export function calculateStreak(activityMap) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (activityMap[key]) streak++;
    else break;
  }
  return streak;
}

// শেষ ৭ দিনের ক্যালেন্ডার — { date, count } লিস্ট, সবচেয়ে পুরনোটা আগে (হিটম্যাপ রেন্ডারে ব্যবহার হবে)
export function buildLast7Days(activityMap) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days.push({ date: key, count: activityMap[key] || 0, label: d.toLocaleDateString("bn-BD", { weekday: "short" }) });
  }
  return days;
}

// সাবজেক্ট অনুযায়ী পারফরম্যান্স ব্রেকডাউন — কোন সাবজেক্টে শক্তিশালী/দুর্বল সেটা বোঝাতে
// results = [{ subjectId, score, totalMarks, ... }]
export function calculateSubjectBreakdown(results) {
  const map = {};
  results.forEach((r) => {
    if (!r.subjectId) return;
    if (!map[r.subjectId]) map[r.subjectId] = { totalScore: 0, totalMarks: 0, examCount: 0 };
    map[r.subjectId].totalScore += r.score || 0;
    map[r.subjectId].totalMarks += r.totalMarks || 0;
    map[r.subjectId].examCount += 1;
  });

  return Object.entries(map)
    .map(([subjectId, v]) => ({
      subjectId,
      examCount: v.examCount,
      percentage: v.totalMarks > 0 ? Math.round((v.totalScore / v.totalMarks) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}
