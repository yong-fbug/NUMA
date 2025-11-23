import type { Card, LogicCollection } from "../content/types/card";

export const computeOperator = (
  a: number,
  b: number,
  op: LogicCollection["operator"]
) => {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    default:
      return a;
  }
};

export const computeAll = (cards: Card[], cardsLogic: LogicCollection[]) => {
  const results: Record<string, number> = {};
  const visiting = new Set<string>();

  const dfs = (cardId: string): number => {
    if (cardId in results) return results[cardId];
    if (visiting.has(cardId)) return 0;

    visiting.add(cardId);

    const card = cards.find((c) => c.id === cardId);
    if (!card) {
      visiting.delete(cardId);
      return (results[cardId] = 0);
    }

    let val = card.cardValue.reduce((s, cv) => s + (Number(cv.value) || 0), 0);

    const outgoing = cardsLogic.filter((l) => l.linkFrom === cardId);

    for (const l of outgoing) {
      const childCard = cards.find((c) => c.id === l.linkTo);
      if (!childCard) continue;
      if (!validateOperation(card.title, childCard.title, l.operator)) {
        console.warn(
          "Invalid Operation",
          card.title,
          l.operator,
          childCard.title
        );
        continue;
      }
      const childVal = dfs(l.linkTo);
      val = computeOperator(val, childVal, l.operator);
    }
    visiting.delete(cardId);
    return (results[cardId] = val);
  };
  cards.forEach((c) => dfs(c.id));
  return results;
};

export const validateOperation = (
  fromTitle: string,
  toTitle: string,
  op: string
) => {
  const [a, b] = [fromTitle.toLowerCase(), toTitle.toLowerCase()].sort();

  if (op === "+" && a === "savings" && b === "cost") {
    return false;
  }
  if (op === "+" && a === "cost" && b === "savings") {
    return false;
  }

  return true;
};

export const computeName = (
  fromTitle: string,
  toTitle: string,
  op: string
): string => {
  const [a, b] = [fromTitle.toLowerCase(), toTitle.toLowerCase()].sort();

  if (op === "+" && a === "cost" && b === "income") return "net income";
  if (op === "+" && a === "income" && b === "savings")
    return "total positive flow";
  if (op === "+" && a === "cost" && b === "debt") return "liability growth";
  if (op === "-" && a === "income" && b === "debt") return "debt payoff";

  return `${fromTitle} ${op} ${toTitle}`;
};
