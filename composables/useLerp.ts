// Linear interpolation function
export default function (start: number, end: number, amount: number): number {
  return start * (1 - amount) + end * amount;
}
