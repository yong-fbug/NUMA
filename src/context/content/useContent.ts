import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Content } from "./content.types";

const CONTENT_KEY = ["content"];

export const useContent = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Content[]>({
    queryKey: CONTENT_KEY,
    queryFn: async () => {
      const saved = localStorage.getItem("contents");
      return saved ? JSON.parse(saved) : [];
    },
  });

  const contents = query.data ?? [];

  const addContent = useMutation({
    mutationFn: async ({ title, description }: Omit<Content, "id">) => {
      const currentContents =
        queryClient.getQueryData<Content[]>(CONTENT_KEY) ?? [];
      const newContent: Content = { id: Date.now(), title, description };
      const updated = [...currentContents, newContent];
      localStorage.setItem("contents", JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(CONTENT_KEY, updated);
    },
  });

  const deleteContent = useMutation({
    mutationFn: async (id: number) => {
      const currentContents =
        queryClient.getQueryData<Content[]>(CONTENT_KEY) ?? [];
      const updated = currentContents.filter((c) => c.id !== id);
      localStorage.setItem("contents", JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(CONTENT_KEY, updated);
    },
  });

  return {
    contents,
    addContent: (title: string, description: string) =>
      addContent.mutate({ title, description }),
    deleteContent: (id: number) => deleteContent.mutate(id),
  };
};
