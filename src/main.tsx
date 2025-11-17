import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ContentProvider } from "./context/content/ContentProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./context/queryClient.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ContentProvider>
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>
    </ContentProvider>
  </BrowserRouter>
);
