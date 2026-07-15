// toast.js
// সহজ নোটিফিকেশন দেখানোর জন্য — সাকসেস/এরর মেসেজ ইউজারকে দেখাতে ব্যবহার হবে

export function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`; // css/global.css এ স্টাইল থাকবে
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("toast-visible"), 10);
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
