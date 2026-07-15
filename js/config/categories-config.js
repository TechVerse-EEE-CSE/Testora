// categories-config.js
// একটাই জায়গায় ক্যাটাগরি (এসএসসি/এইচএসসি/ভর্তি/বিসিএস) আর প্রতিটার সাবজেক্ট লিস্ট রাখা হয়।
// dashboard-page.js এ ইউজার প্রথমে ক্যাটাগরি বেছে নেয়, তারপর সেই ক্যাটাগরির সাবজেক্ট দেখে।
// admin/add-question-page.js এ প্রশ্ন যোগ করার সময়ও এই একই লিস্ট থেকে ক্যাটাগরি+সাবজেক্ট বাছাই হয়।
//
// নতুন ক্যাটাগরি/সাবজেক্ট যোগ করতে চাইলে নিচের অ্যারেতে নতুন এϾট্রি বসান —
// subject.id অবশ্যই সব ক্যাটাগরি মিলিয়ে ইউনিক হতে হবে (Firestore এ questions/exams এর subjectId হিসেবে সেভ হয়)।

export const CATEGORIES = [
  {
    id: "ssc",
    name: "এসএসসি",
    subjects: [
      { id: "ssc-bangla-1st", name: "বাংলা ১ম পত্র" },
      { id: "ssc-bangla-2nd", name: "বাংলা ২য় পত্র" },
      { id: "ssc-english-1st", name: "ইংরেজি ১ম পত্র" },
      { id: "ssc-english-2nd", name: "ইংরেজি ২য় পত্র" },
      { id: "ssc-math", name: "সাধারণ গণিত" },
      { id: "ssc-higher-math", name: "উচ্চতর গণিত" },
      { id: "ssc-physics", name: "পদার্থবিজ্ঞান" },
      { id: "ssc-chemistry", name: "রসায়ন" },
      { id: "ssc-biology", name: "জীববিজ্ঞান" },
      { id: "ssc-ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি" },
      { id: "ssc-bgs", name: "বাংলাদেশ ও বিশ্বপরিচয়" },
      { id: "ssc-geography", name: "ভূগোল ও পরিবেশ" },
      { id: "ssc-religion", name: "ধর্ম ও নৈতিক শিক্ষা" },
      { id: "ssc-accounting", name: "হিসাববিজ্ঞান" },
      { id: "ssc-business", name: "ব্যবসায় উদ্যোগ" },
      { id: "ssc-economics", name: "অর্থনীতি" },
    ],
  },
  {
    id: "hsc",
    name: "এইচএসসি",
    subjects: [
      { id: "hsc-bangla-1st", name: "বাংলা ১ম পত্র" },
      { id: "hsc-bangla-2nd", name: "বাংলা ২য় পত্র" },
      { id: "hsc-english-1st", name: "ইংরেজি ১ম পত্র" },
      { id: "hsc-english-2nd", name: "ইংরেজি ২য় পত্র" },
      { id: "hsc-ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি" },
      { id: "hsc-physics-1st", name: "পদার্থবিজ্ঞান ১ম পত্র" },
      { id: "hsc-physics-2nd", name: "পদার্থবিজ্ঞান ২য় পত্র" },
      { id: "hsc-chemistry-1st", name: "রসায়ন ১ম পত্র" },
      { id: "hsc-chemistry-2nd", name: "রসায়ন ২য় পত্র" },
      { id: "hsc-biology-1st", name: "জীববিজ্ঞান ১ম পত্র" },
      { id: "hsc-biology-2nd", name: "জীববিজ্ঞান ২য় পত্র" },
      { id: "hsc-higher-math-1st", name: "উচ্চতর গণিত ১ম পত্র" },
      { id: "hsc-higher-math-2nd", name: "উচ্চতর গণিত ২য় পত্র" },
      { id: "hsc-accounting-1st", name: "হিসাববিজ্ঞান ১ম পত্র" },
      { id: "hsc-accounting-2nd", name: "হিসাববিজ্ঞান ২য় পত্র" },
      { id: "hsc-management-1st", name: "ব্যবস্থাপনা ১ম পত্র" },
      { id: "hsc-management-2nd", name: "ব্যবস্থাপনা ২য় পত্র" },
      { id: "hsc-economics-1st", name: "অর্থনীতি ১ম পত্র" },
      { id: "hsc-economics-2nd", name: "অর্থনীতি ২য় পত্র" },
      { id: "hsc-history-1st", name: "ইতিহাস ১ম পত্র" },
      { id: "hsc-history-2nd", name: "ইতিহাস ২য় পত্র" },
      { id: "hsc-civics-1st", name: "পৌরনীতি ও সুশাসন ১ম পত্র" },
      { id: "hsc-civics-2nd", name: "পৌরনীতি ও সুশাসন ২য় পত্র" },
    ],
  },
  {
    id: "admission",
    name: "ভর্তি পরীক্ষা",
    subjects: [
      { id: "adm-bangla", name: "বাংলা" },
      { id: "adm-english", name: "ইংরেজি" },
      { id: "adm-math", name: "গণিত" },
      { id: "adm-physics", name: "পদার্থবিজ্ঞান" },
      { id: "adm-chemistry", name: "রসায়ন" },
      { id: "adm-biology", name: "জীববিজ্ঞান" },
      { id: "adm-ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি" },
      { id: "adm-gk-bd", name: "সাধারণ জ্ঞান — বাংলাদেশ বিষয়াবলী" },
      { id: "adm-gk-intl", name: "সাধারণ জ্ঞান — আন্তর্জাতিক বিষয়াবলী" },
      { id: "adm-analytical", name: "বিশ্লেষণধর্মী দক্ষতা" },
    ],
  },
  {
    id: "bcs",
    name: "বিসিএস",
    subjects: [
      { id: "bcs-bangla", name: "বাংলা" },
      { id: "bcs-english", name: "ইংরেজি" },
      { id: "bcs-bd-affairs", name: "বাংলাদেশ বিষয়াবলী" },
      { id: "bcs-intl-affairs", name: "আন্তর্জাতিক বিষয়াবলী" },
      { id: "bcs-geography", name: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা" },
      { id: "bcs-science", name: "সাধারণ বিজ্ঞান" },
      { id: "bcs-computer", name: "কম্পিউটার ও তথ্যপ্রযুক্তি" },
      { id: "bcs-math", name: "গাণিতিক যুক্তি" },
      { id: "bcs-mental", name: "মানসিক দক্ষতা" },
      { id: "bcs-ethics", name: "নৈতিকতা, মূল্যবোধ ও সুশাসন" },
    ],
  },
];

// সাহায্যকারী ফাংশন — id দিয়ে ক্যাটাগরি খুঁজে বের করা
export function getCategoryById(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) || null;
}

// সাহায্যকারী ফাংশন — id দিয়ে সাবজেক্ট (ও তার ক্যাটাগরি) খুঁজে বের করা
export function getSubjectById(subjectId) {
  for (const category of CATEGORIES) {
    const subject = category.subjects.find((s) => s.id === subjectId);
    if (subject) return { ...subject, categoryId: category.id, categoryName: category.name };
  }
  return null;
}
