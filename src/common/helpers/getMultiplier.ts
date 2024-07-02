export const getMultiplier = (amount: number, multiplier: number) => {
  if (amount > 100000) {
    return multiplier + 0.1;
  }
};
