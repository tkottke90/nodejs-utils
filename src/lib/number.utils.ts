export function padNumber(input: number, padSize = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumIntegerDigits: padSize
  }).format(input);
}
