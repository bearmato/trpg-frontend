export type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

export const rollDice = (selectedDice: { [key in DiceType]: number }) => {
  const results: { type: DiceType; value: number }[] = [];
  Object.entries(selectedDice).forEach(([type, quantity]) => {
    const max = parseInt(type.substring(1));
    for (let i = 0; i < quantity; i++) {
      results.push({ type: type as DiceType, value: Math.floor(Math.random() * max) + 1 });
    }
  });
  return results;
};