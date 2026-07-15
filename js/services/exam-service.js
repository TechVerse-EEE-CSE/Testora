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
  limit,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// অ্যাডমিন থেকে নতুন এক্সাম তৈরি
export async function createExam(examData) {
  // examData = { subjectId, title, durationMin, totalMarks, questionIds: [] }
  return await addDoc(collection(db, COLLECTIONS.EXAMS), examData);
}

// ⚠️ আগে admin panel-এ শুধু "প্রশ্ন যোগ করুন" পেজ ছিল, কিন্তু কোনো exam তৈরির UI ছিল না —
// createExam() কখনো কল-ই হতো না। ফলে প্রশ্ন questions কালেকশনে ঢুকতো ঠিকই, কিন্তু কোনো exam
// document তার questionIds-এ সেটা রেফার না করায় dashboard-এ সেই সাবজেক্টে কিছুই দেখাতো না।
// এখন প্রতিবার প্রশ্ন যোগ হলে এই ফাংশন কল হয় — সেই সাবজেক্টের সব প্রশ্ন একসাথে নিয়ে
// একটা "প্র্যাকটিস টেস্ট" exam বানায় (না থাকলে) বা আপডেট করে (থাকলে), যাতে আলাদা করে
// exam তৈরির পেজে গিয়ে কিছু করতে না হয়।
export async function syncExamForSubject(subjectId, subjectName, questions) {
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  const questionIds = questions.map((q) => q.id);

  const existingQuery = query(
    collection(db, COLLECTIONS.EXAMS),
    where("subjectId", "==", subjectId),
    limit(1)
  );
  const snap = await getDocs(existingQuery);

  if (snap.empty) {
    await createExam({
      subjectId,
      title: `${subjectName} — প্র্যাকটিস টেস্ট`,
      durationMin: 30,
      totalMarks,
      questionIds,
    });
  } else {
    const examDocId = snap.docs[0].id;
    await updateDoc(doc(db, COLLECTIONS.EXAMS, examDocId), { totalMarks, questionIds });
  }
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
