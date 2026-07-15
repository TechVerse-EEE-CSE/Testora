// question-service.js
// শুধু questions কালেকশনের সাথে কাজ

import { db } from "../config/firebase-config.js";
import { COLLECTIONS } from "../config/firestore-paths.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  documentId,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// অ্যাডমিন প্যানেল থেকে নতুন প্রশ্ন যোগ করা
export async function addQuestion(questionData) {
  // questionData = { subjectId, question, options: [], correctAnswer, marks }
  return await addDoc(collection(db, COLLECTIONS.QUESTIONS), questionData);
}

// নির্দিষ্ট আইডি লিস্ট অনুযায়ী প্রশ্ন লোড করা (এক্সাম চালু হওয়ার সময়)
export async function getQuestionsByIds(questionIds) {
  if (questionIds.length === 0) return [];
  const q = query(
    collection(db, COLLECTIONS.QUESTIONS),
    where(documentId(), "in", questionIds.slice(0, 30)) // Firestore-এর 'in' লিমিট ৩০
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// একটা নির্দিষ্ট বিষয়ের সব প্রশ্ন লোড করা
export async function getQuestionsBySubject(subjectId) {
  const q = query(collection(db, COLLECTIONS.QUESTIONS), where("subjectId", "==", subjectId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
