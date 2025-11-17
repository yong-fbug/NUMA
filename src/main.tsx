import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ContentProvider } from "./context/content/ContentProvider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ContentProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ContentProvider>
  </BrowserRouter>
);
