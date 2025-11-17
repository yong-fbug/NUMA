import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const HeaderBranding = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-6 border-r border-white h-16">
      <button
        className="md:hidden flex items-center text-slate-800"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <h1
        onClick={() => navigate("/")}
        className="hidden md:block text-xl font-bold tracking-widest text-slate-800 cursor-pointer"
      >
        NUMA
      </h1>
    </div>
  );
};
