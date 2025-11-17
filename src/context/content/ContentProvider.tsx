import { createContext, useState, type ReactNode } from "react";
import type { Content, ContentContextType } from "./content.types";

export const ContentContext = createContext<ContentContextType | undefined>(
  undefined
);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [contents, setContents] = useState<Content[]>([]);

  const addContent = (title: string, description: string) => {
    setContents((prev) => [...prev, { id: Date.now(), title, description }]);
  };

  const deleteContent = (id: number) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ContentContext.Provider value={{ contents, addContent, deleteContent }}>
      {children}
    </ContentContext.Provider>
  );
};
