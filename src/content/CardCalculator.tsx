import { useCallback, useMemo, useState } from "react";
import type { Card, CardValue, LogicCollection } from "./types/card";
import { CardId } from "./types/CardId";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  computeAll,
  computeName,
  validateOperation,
} from "../utils/ComputationEngine";

const valueId = CardId();

const ALLOWED_TITLES = ["income", "cost", "savings", "debt"] as const;
type AllowedTitle = (typeof ALLOWED_TITLES)[number];

export const CardCalculator = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLogic, setCardsLogic] = useState<LogicCollection[]>([]);
  const [linkControls, setLinkControls] = useState<
    Record<string, { to: string; operator: LogicCollection["operator"] }>
  >({});
  const [newTitle, setNewTitle] = useState<AllowedTitle>("income");
  const [message, setMessage] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState<Boolean>(false);
  const [showDeletePanel, setshowDeletePanel] = useState<string | null>(null);

  console.log("Cards", cards);
  console.log("Links", linkControls);

  const addCard = (title?: string) => {
    const t = (title ?? newTitle).trim();
    if (!t) return;

    const newCardId = CardId();
    const card: Card = {
      id: newCardId,
      title: t as AllowedTitle,
      cardValue: [{ id: CardId(), label: "label", value: "" }],
    };
    setCards((p) => [...p, card]);
    setNewTitle("income");
    setShowAddPanel(false);
  };

  const addCardInput = (cardInputId: string) => {
    setCards((p) =>
      p.map((c) =>
        c.id === cardInputId
          ? {
              ...c,
              cardValue: [
                ...c.cardValue,
                { id: CardId(), label: "", value: "" },
              ],
            }
          : c
      )
    );
  };

  const removeCardInput = (cardId: string, valueId: string) => {
    setCards((p) =>
      p.map((c) =>
        c.id === cardId
          ? { ...c, cardValue: c.cardValue.filter((v) => v.id !== valueId) }
          : c
      )
    );
  };

  const updateCardValue = (
    cardId: string,
    valueId: string,
    patch: Partial<CardValue>
  ) => {
    setCards((p) =>
      p.map((c) =>
        c.id === cardId
          ? {
              ...c,
              cardValue: c.cardValue.map((v) =>
                v.id === valueId ? { ...v, ...patch } : v
              ),
            }
          : c
      )
    );
  };

  const pathExists = useCallback(
    (startId: string, targetId: string): boolean => {
      const adj: Record<string, string[]> = {};
      cardsLogic.forEach((l) => {
        if (!adj[l.linkFrom]) adj[l.linkFrom] = [];
        adj[l.linkFrom].push(l.linkTo);
      });

      const stack = [startId];
      const seen = new Set<string>();

      while (stack.length) {
        const cur = stack.pop()!;
        if (cur === targetId) return true;
        if (seen.has(cur)) continue;
        seen.add(cur);
        (adj[cur] || []).forEach((n) => stack.push(n));
      }
      return false;
    },
    [cardsLogic]
  );

  const addLink = (fromId: string) => {
    const ctrl = linkControls[fromId];

    if (!ctrl || !ctrl.to) {
      setMessage("Choose a 'Link To' target first.");
      setTimeout(() => {
        setMessage(null);
      }, 1000);
      return;
    }
    const fromCard = cards.find((c) => c.id === fromId);
    const toCard = cards.find((c) => c.id === ctrl.to);

    if (!fromCard || !toCard) {
      setMessage("Invalid card reference");
      setTimeout(() => {
        setMessage(null);
      }, 1000);
      return;
    }

    if (!validateOperation(fromCard?.title, toCard?.title, ctrl.operator)) {
      setMessage(
        `Operation not allowed: ${fromCard.title} ${ctrl.operator} ${toCard.title}`
      );
      return;
    }

    if (ctrl.to === fromId) {
      setMessage("Cannot link a card to itself.");
      return;
    }

    const resultName = computeName(
      fromCard.title.toLowerCase(),
      toCard.title.toLowerCase(),
      ctrl.operator
    );

    if (pathExists(ctrl.to, fromId)) {
      setMessage("Cannot add link: ");
      return;
    }

    setCardsLogic((p) => [
      ...p,
      {
        linkFrom: fromId,
        linkTo: ctrl.to,
        operator: ctrl.operator,
        name: resultName,
      },
    ]);
  };

  const removeCard = (cardId: string) => {
    setCards((p) => p.filter((c) => c.id !== cardId));

    setCardsLogic((p) =>
      p.filter((l) => l.linkFrom !== cardId && l.linkTo !== cardId)
    );

    setLinkControls((p) => {
      const copy = { ...p };
      delete copy[cardId];
      return copy;
    });
  };

  const removeLink = (index: number) => {
    setCardsLogic((p) => p.filter((_, i) => i !== index));
  };

  //
  const computedValues = useMemo(
    () => computeAll(cards, cardsLogic),
    [cards, cardsLogic]
  );

  //
  const rootCards = useMemo(
    () => cards.filter((c) => !cardsLogic.some((l) => l.linkTo === c.id)),
    [cards, cardsLogic]
  );

  //
  const totalResult = useMemo(
    () => rootCards.reduce((s, c) => s + (computedValues[c.id] ?? 0), 0),
    [rootCards, computedValues]
  );

  //open delete input
  const deleteInput = (cardId: string) => {
    setshowDeletePanel((p) => (p === cardId ? null : cardId));
  };

  const setControl = (
    cardId: string,
    next: Partial<{ to: string; operator: LogicCollection["operator"] }>
  ) =>
    setLinkControls((p) => ({
      ...(p || {}),
      [cardId]: {
        to: next.to ?? p?.[cardId]?.to ?? "",
        operator: next.operator ?? p?.[cardId]?.operator ?? "+",
      },
    }));

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowAddPanel((s) => !s)}
          className="rounded bg-indigo-600 text-white px-3 py-1"
        >
          {showAddPanel ? "Cancel" : "Add Card"}
        </button>
        {cardsLogic.map((l) => (
          <div key={`${l.linkFrom}-${l.linkTo}`}>
            {`
               ${l.name}: ${totalResult}`}
          </div>
        ))}
      </div>

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
              <option key={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
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

      {message && <div className="text-sm text-red-600">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="p-3 bg-slate-100 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">
                {card.title}{" "}
                <span className="text-xs text-gray-500">
                  ({card.id.slice(0, 6)})
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  title="Add value"
                  onClick={() => addCardInput(card.id)}
                  className="px-2 py-1 text-sm text-black rounded"
                >
                  <Plus />
                </button>

                <button onClick={() => deleteInput(card.id)}>
                  {showDeletePanel === card.id ? "Cancel" : "Delete"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {card.cardValue.map((cv) => (
                <div key={cv.id} className="flex gap-2 items-center">
                  <input
                    className="flex-1 border p-1 rounded"
                    placeholder="label"
                    value={cv.label}
                    onChange={(e) =>
                      updateCardValue(card.id, cv.id, { label: e.target.value })
                    }
                  />
                  <input
                    className="w-24 border p-1 rounded"
                    placeholder="0"
                    value={cv.value}
                    onChange={(e) =>
                      updateCardValue(card.id, cv.id, { value: e.target.value })
                    }
                    type="number"
                  />

                  {showDeletePanel === card.id && (
                    <button onClick={() => removeCardInput(card.id, cv.id)}>
                      <X />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* linking controls (controlled, no direct DOM access) */}
            <div className="mt-3 border-t pt-3">
              <div className="text-xs text-gray-600 mb-1">
                Create link from this card:
              </div>
              <div className="flex gap-2 items-center">
                <select
                  className="border p-1 rounded flex-1"
                  value={linkControls[card.id]?.to ?? ""}
                  onChange={(e) => setControl(card.id, { to: e.target.value })}
                >
                  <option value="">Link To...</option>
                  {cards
                    .filter((c) => c.id !== card.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.id.slice(0, 6)})
                      </option>
                    ))}
                </select>

                <select
                  className="border p-1 rounded"
                  value={linkControls[card.id]?.operator ?? "+"}
                  onChange={(e) =>
                    setControl(card.id, {
                      operator: e.target.value as LogicCollection["operator"],
                    })
                  }
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">*</option>
                  <option value="/">/</option>
                </select>

                <button
                  onClick={() => addLink(card.id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Add Link
                </button>
              </div>

              {/* show outgoing/incoming links for this card */}
              <div className="mt-2 text-sm text-gray-700">
                <div className="mb-1 font-medium">Links from this card</div>
                {cardsLogic.filter((l) => l.linkFrom === card.id).length ===
                  0 && <div className="text-xs text-gray-500">— none —</div>}
                {cardsLogic
                  .filter((l) => l.linkFrom === card.id)
                  .map((l, i) => {
                    const toCard = cards.find((c) => c.id === l.linkTo);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="text-xs">
                          {card.title}{" "}
                          <ChevronRight className="inline-block h-3 w-3" />{" "}
                          {toCard?.title ?? l.linkTo} ({l.operator})
                        </div>
                        <button
                          className="text-xs text-red-600"
                          onClick={() => {
                            // remove this specific link
                            const idx = cardsLogic.findIndex(
                              (x) =>
                                x.linkFrom === l.linkFrom &&
                                x.linkTo === l.linkTo &&
                                x.operator === l.operator
                            );
                            if (idx >= 0) removeLink(idx);
                          }}
                        >
                          x
                        </button>
                      </div>
                    );
                  })}

                <div className="mt-2 mb-1 font-medium">
                  Links into this card
                </div>
                {cardsLogic.filter((l) => l.linkTo === card.id).length ===
                  0 && <div className="text-xs text-gray-500">— none —</div>}
                {cardsLogic
                  .filter((l) => l.linkTo === card.id)
                  .map((l, i) => {
                    const fromCard = cards.find((c) => c.id === l.linkFrom);
                    return (
                      <div key={i} className="text-xs">
                        {fromCard?.title ?? l.linkFrom}{" "}
                        <ChevronLeft className="inline-block h-3 w-3" />{" "}
                        {l.name ??
                          `${card.title} ${l.operator} ${fromCard?.title}`}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="mt-3 text-sm text-blue-700">
              Total:{" "}
              <strong>
                {card.title}: {computedValues[card.id] ?? 0}
              </strong>
            </div>
            <button
              title="Delete card"
              onClick={() => removeCard(card.id)}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* small footer with computed JSON for debugging */}
      <div className="mt-4 text-xs text-gray-500">
        <div>
          Cards: {cards.length} · Links: {cardsLogic.length} · Roots:{" "}
          {rootCards.length}
        </div>
      </div>
    </div>
  );
};
