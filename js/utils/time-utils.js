// time-utils.js
// শুধু সময়-সম্পর্কিত হেল্পার ফাংশন

// সেকেন্ডকে "MM:SS" ফরম্যাটে রূপান্তর — এক্সাম টাইমারে ব্যবহার হবে
export function formatSecondsToTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// মিনিটকে মানুষের পড়ার মতো বাংলা টেক্সটে রূপান্তর — স্ট্যাটস পেজে ব্যবহার হবে
export function formatMinutesToReadable(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} মিনিট`;
  return `${hours} ঘন্টা ${minutes} মিনিট`;
}

// দুই timestamp-এর মধ্যে ব্যয়িত সময় (সেকেন্ডে) বের করা
export function getElapsedSeconds(startTime, endTime) {
  return Math.floor((endTime - startTime) / 1000);
}
