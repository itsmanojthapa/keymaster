export default function textLength(text: string): number {
  let len = 0;
  text.split("").map((word) => {
    if (word != " ") len++;
  });
  return len;
}
