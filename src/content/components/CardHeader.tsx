import { InfoIcon, PlusCircle } from "lucide-react";
import { useState } from "react";

type AllowedTitle = (typeof ALLOWED_TITLES)[number];
const ALLOWED_TITLES = ["income", "cost", "savings", "debt"] as const;
const valueId = CardId();

export const CardHeader = () => {
  const [newTitle, setNewTitle] = useState<AllowedTitle>("income");

  const addCard = (title?: string) => {
    const t = (title ?? newTitle).trim();
    if (!t) return;

    const newCardId = CardId();
    const card: Card = {
      id: newCardId,
      title: t as AllowedTitle,
      cardValue: [{ id: CardId(), label: "value", value: "" }],
    };
    setCards((p) => [...p, card]);
    setNewTitle("income");
    setShowAddPanel(false);
  };
  return (
    <div className="flex flex-1 items-center justify-center space-x-4 px-6 h-16">
      <div className="flex flex-1 items-center justify-center space-x-4 px-6 h-16">
        {showAddPanel && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCard();
            }}
            className="flex gap-2"
          >
            <select
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value as AllowedTitle)}
            >
              {ALLOWED_TITLES.map((t) => (
                <option key={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-green-600 text-white px-3 rounded"
            >
              Add
            </button>
          </form>
        )}

        <button className="hover:bg-slate-200 p-2 rounded-full transition-colors">
          <InfoIcon className="w-6 h-6 text-slate-700 hover:text-slate-500 cursor-pointer transition-colors" />
        </button>
      </div>
    </div>
  );
};
