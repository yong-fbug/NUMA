import { useState } from "react";

type Link = { linkFrom: string; linkTo: string };
type Card = {
  id: string;
  label: string;
  value: string;
  operator: string;
  links: Link[];
};

export const CardCalculator = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [totalResult, setTotalResult] = useState<number | null>(null);
  console.log(cards, "result:", totalResult);

  const addCard = () => {
    if (!newLabel.trim()) return;
    setCards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: newLabel,
        value: "",
        operator: "+",
        links: [],
      },
    ]);
    setNewLabel("");
    setShowAddPanel(false);
  };

  const addLink = (fromId: string, toId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === fromId
          ? { ...c, links: [...c.links, { linkFrom: fromId, linkTo: toId }] }
          : c
      )
    );
  };

  const computeCard = (card: Card, visited = new Set<string>()): number => {
    if (visited.has(card.id)) return 0; // avoid loops
    visited.add(card.id);

    let val = Number(card.value) || 0;

    card.links.forEach((link) => {
      const linkedCard = cards.find((c) => c.id === link.linkTo);
      if (linkedCard)
        val = computeOperator(
          val,
          computeCard(linkedCard, visited),
          card.operator
        );
    });

    return val;
  };

  const computeOperator = (a: number, b: number, op: string): number => {
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

  const handleSubmit = () => {
    const sum = cards
      .filter((c) => c.links.length > 0)
      .reduce((acc, card) => acc + computeCard(card), 0);

    setTotalResult(sum);
  };

  return (
    <div>
      <button onClick={() => setShowAddPanel((p) => !p)}>
        {showAddPanel ? "Cancel" : "Add Card"}
      </button>
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

      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col items-center bg-slate-200 p-4 rounded-xl gap-2"
        >
          <input
            type="text"
            value={card.label}
            onChange={(e) =>
              setCards((prev) =>
                prev.map((c) =>
                  c.id === card.id ? { ...c, label: e.target.value } : c
                )
              )
            }
            className="border p-1 w-full"
          />
          <input
            type="number"
            value={card.value}
            onChange={(e) =>
              setCards((prev) =>
                prev.map((c) =>
                  c.id === card.id ? { ...c, value: e.target.value } : c
                )
              )
            }
            className="border p-1 w-full"
          />

          <div className="flex gap-2 mt-2">
            <select id={`link-to-${card.id}`} className="border p-1">
              <option value="">Link To...</option>
              {cards
                .filter((c) => c.id !== card.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const sel = document.getElementById(
                  `link-to-${card.id}`
                ) as HTMLSelectElement;
                if (sel.value) addLink(card.id, sel.value);
              }}
              className="bg-green-600 text-white px-2 rounded-md"
            >
              Add Link
            </button>
          </div>

          <div className="text-sm text-gray-700 mt-1">
            {card.links.map((l, i) => (
              <div key={i}>
                {card.label} →{" "}
                {cards.find((c) => c.id === l.linkTo)?.label || "?"}
              </div>
            ))}
          </div>

          <select
            value={card.operator}
            onChange={(e) =>
              setCards((prev) =>
                prev.map((c) =>
                  c.id === card.id ? { ...c, operator: e.target.value } : c
                )
              )
            }
            className="border mt-1 p-1"
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>
        </div>
      ))}

      <button
        onClick={handleSubmit}
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
