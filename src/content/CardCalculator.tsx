import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type CardValue = {
  id: string;
  label: string;
  value: string;
};

type Card = {
  id: string;
  cardValue: CardValue[];
};

type LogicCollection = {
  operator: string;
  linkFrom: string;
  linkTo: string;
};

export const CardCalculator = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLogic, setCardsLogic] = useState<LogicCollection[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [computedValues, setComputedValues] = useState<Record<string, number>>(
    {}
  );
  const [totalResult, setTotalResult] = useState<number | null>(null);

  const addCard = (cardId?: string) => {
    if (!newLabel.trim()) return;
    const newId = `A${cards.length + 1}`;
    //temporarly id for card value
    const newCardId = `B${cards.length + 1}`;
    if (cardId) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId
            ? {
                ...card,
                cardValue: [
                  ...card.cardValue,
                  { id: newId, label: "", value: "" },
                ],
              }
            : card
        )
      );
    } else {
      setCards((prev) => [
        ...prev,
        {
          id: newId,
          cardValue: [{ id: newCardId, label: newLabel, value: "" }],
        },
      ]);
    }

    setNewLabel("");
    setShowAddPanel(false);
  };

  const addLink = (fromId: string, toId: string, operator: string) => {
    setCardsLogic((prev) => [
      ...prev,
      { linkFrom: fromId, linkTo: toId, operator },
    ]);
  };

  const computeOperator = (a: number, b: number, op: string) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b !== 0 ? a / b : a;
      default:
        return a;
    }
  };

  const computeAllCards = () => {
    const results: Record<string, number> = {};
    const visited = new Set<string>();

    const compute = (card: Card): number => {
      if (visited.has(card.id)) return results[card.id] || 0;
      visited.add(card.id);

      let val = card.cardValue.reduce((sum, cv) => {
        return sum + (Number(cv.value) || 0);
      }, 0);

      const outgoingLinks = cardsLogic.filter((l) => l.linkFrom === card.id);

      outgoingLinks.forEach((link) => {
        const child = cards.find((c) => c.id === link.linkTo);
        if (child) val = computeOperator(val, compute(child), link.operator);
      });

      results[card.id] = val;
      return val;
    };

    cards.forEach(compute);
    setComputedValues(results);

    // total = sum of all cards with links
    const total = cardsLogic.reduce((acc, link) => {
      return acc + (results[link.linkFrom] || 0);
    }, 0);
    setTotalResult(total);
  };
  console.log("CARDS", cards);
  console.log("card links", cardsLogic);
  console.log("Computation Storage", computedValues);

  return (
    <div>
      <button onClick={() => setShowAddPanel((p) => !p)}>
        {showAddPanel ? "Cancel" : "Add Card"}
      </button>

      {/* Add card */}
      {showAddPanel && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCard();
          }}
          className="flex gap-2 mt-2"
        >
          <input
            type="text"
            placeholder="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="border rounded-md p-2 flex-1"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      )}

      <div className="grid grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col items-center bg-slate-200 p-4 rounded-xl gap-2"
          >
            <div className="flex gap-2 mt-2">
              <span>{card.id}</span>
              <button>Add</button>

              <select id={`link-to-${card.id}`} className="border p-1">
                <option value="">Link To...</option>
                {/* label for linking use proper name */}
                {cards
                  .filter((c) => c.id !== card.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const sel = document.getElementById(
                    `link-to-${card.id}`
                  ) as HTMLSelectElement;
                  const opSel = document.getElementById(
                    `operator-${card.id}`
                  ) as HTMLSelectElement;
                  if (sel.value) addLink(card.id, sel.value, opSel.value);
                }}
                className="bg-green-600 text-white px-2 rounded-md"
              >
                Add Link
              </button>
              <select id={`operator-${card.id}`} className="border mt-1 p-1">
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
            </div>

            {card.cardValue.map((cv) => (
              <div
                key={cv.id}
                className="flex items-center justify-center gap-2"
              >
                <input
                  type="text"
                  value={cv.label}
                  onChange={(e) =>
                    setCards((prev) =>
                      prev.map((c) =>
                        c.id === card.id
                          ? {
                              ...c,
                              cardValue: c.cardValue.map((item) =>
                                item.id === cv.id
                                  ? { ...item, label: e.target.value }
                                  : item
                              ),
                            }
                          : c
                      )
                    )
                  }
                  className="border p-1 w-full"
                />
                :
                <input
                  type="number"
                  value={cv.value}
                  onChange={(e) =>
                    setCards((prev) =>
                      prev.map((c) =>
                        c.id === card.id
                          ? {
                              ...c,
                              cardValue: c.cardValue.map((item) =>
                                item.id === cv.id
                                  ? { ...item, value: e.target.value }
                                  : item
                              ),
                            }
                          : c
                      )
                    )
                  }
                  className="border p-1 w-full"
                />
                <div className="text-sm text-gray-700 mt-1">
                  {cardsLogic
                    .filter((l) => l.linkFrom === card.id)
                    .map((l, i) => {
                      const toCardLabel =
                        cards.find((c) => c.id === l.linkTo)?.id || "";
                      return (
                        <div key={i}>
                          {cv.label} <ChevronRight /> {toCardLabel} (
                          {l.operator})
                        </div>
                      );
                    })}

                  {cardsLogic
                    .filter((l) => l.linkTo === card.id)
                    .map((l, i) => {
                      const fromCardLabel =
                        cards.find((c) => c.id === l.linkFrom)?.id || "?";
                      return (
                        <div key={i}>
                          {fromCardLabel} <ChevronLeft /> {cv.label} (
                          {l.operator})
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}

            <div className="mt-1 text-blue-700">
              Computed: {computedValues[card.id] ?? 0}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={computeAllCards}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Show Result
      </button>

      {totalResult !== null && (
        <div className="mt-2 font-bold">TOTAL Result: {totalResult}</div>
      )}
    </div>
  );
};
