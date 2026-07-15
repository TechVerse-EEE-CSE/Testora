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
