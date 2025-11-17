import { useContext } from "react";
import { ContentContext } from "./ContentProvider";

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("error");
  return context;
};
