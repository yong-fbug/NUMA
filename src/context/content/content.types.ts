export type Content = { id: number; title: string; description: string };

export type ContentContextType = {
  contents: Content[];
  addContent: (title: string, description: string) => void;
  deleteContent: (id: number) => void;
};
