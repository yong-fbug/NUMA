import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { ContentHolder } from "./Pages/ContentHolder";
import { ContentMain } from "./Pages/ContentMain";
import { About } from "./components/About";

const App = () => {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route
        path="/*"
        element={
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <main className="flex-1 bg-gray-50 p-6">
                <Routes>
                  <Route path="/" element={<ContentHolder />} />
                  <Route path="/content/:id" element={<ContentMain />} />
                </Routes>
              </main>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
