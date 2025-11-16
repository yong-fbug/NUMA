import { createContext, useContext, useState, type ReactNode } from "react";

type Content = { id: number; title: string; description: string };

type ContentContextType = {
  contents: Content[];
  addContent: (title: string, description: string) => void;
  deleteContent: (id: number) => void;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("erorr");
  return context;
};

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
