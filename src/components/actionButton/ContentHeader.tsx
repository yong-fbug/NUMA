import { Home, PieChart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ContentHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center">
      <button className="hover:bg-slate-200 p-2 rounded-full transition-colors">
        <Home
          onClick={() => navigate(-1)}
          className="w-5 h-5 text-slate-700 hover:text-emerald-500"
        />
      </button>
      <button className="hover:bg-slate-200 p-2 rounded-full transition-colors">
        <PieChart className="w-5 h-5 text-slate-700 hover:text-amber-500" />
      </button>
      <button className="hover:bg-slate-200 p-2 rounded-full transition-colors">
        <Settings className="w-5 h-5 text-slate-700 hover:text-sky-500" />
      </button>
    </div>
  );
};
