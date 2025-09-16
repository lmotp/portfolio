export default function (pos: number) {
  if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
  return -0.5 * ((pos -= 2) * pos - 2);
}
