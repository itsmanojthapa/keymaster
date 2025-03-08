export default function genOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}
