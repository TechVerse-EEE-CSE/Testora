// leaderboard-service.js
// শুধু লিডারবোর্ড রিড করার কাজ — র‍্যাংকিং ক্যালকুলেশন Cloud Function দিয়ে ব্যাকগ্রাউন্ডে হবে

import { db } from "../config/firebase-config.js";
import { COLLECTIONS } from "../config/firestore-paths.js";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { APP_CONFIG } from "../config/app-config.js";

// গ্লোবাল টপ স্কোরার লিস্ট
export async function getGlobalLeaderboard() {
  const q = query(
    collection(db, COLLECTIONS.USERS),
    orderBy("totalMarks", "desc"),
    limit(APP_CONFIG.LEADERBOARD_TOP_LIMIT)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({ rank: i + 1, uid: d.id, ...d.data() }));
}
