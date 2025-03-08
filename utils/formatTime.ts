export default function formatTime(seconds: number): string {
  if (seconds <= 0) return "0 sec";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return remainingSeconds > 0
      ? `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")} min`
      : `${String(minutes).padStart(2, "0")}:00 min`;
  }

  return `${remainingSeconds} sec`;
}
