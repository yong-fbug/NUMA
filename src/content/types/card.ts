export type CardValue = {
  id: string;
  label: string;
  value: string;
};

export type Card = {
  id: string;
  title: "income" | "cost" | "savings" | "debt";
  cardValue: CardValue[];
};

export type LogicCollection = {
  linkFrom: string;
  operator: "+" | "-" | "*" | "/";
  linkTo: string;
  name?: string;
};
