// exam-service.js
// শুধু exams কালেকশন — প্রশ্ন/রেজাল্ট লজিক এখানে নেই, ওগুলো আলাদা ফাইলে

import { db } from "../config/firebase-config.js";
import { COLLECTIONS } from "../config/firestore-paths.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// অ্যাডমিন থেকে নতুন এক্সাম তৈরি
export async function createExam(examData) {
  // examData = { subjectId, title, durationMin, totalMarks, questionIds: [] }
  return await addDoc(collection(db, COLLECTIONS.EXAMS), examData);
}

export async function getExamById(examId) {
  const snap = await getDoc(doc(db, COLLECTIONS.EXAMS, examId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// একটা বিষয়ের সব এক্সাম লিস্ট — dashboard-page.js এ ব্যবহার হবে
export async function getExamsBySubject(subjectId) {
  const q = query(collection(db, COLLECTIONS.EXAMS), where("subjectId", "==", subjectId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
