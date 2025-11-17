import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 60, // any for this wanderful v5
      retry: false,
    } as any,
  },
};

export const queryClient = new QueryClient(config);
