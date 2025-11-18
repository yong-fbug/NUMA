import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HistoryButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 transition-colors6"
    >
      <ChevronLeft className="w-5 h-5 border border:bg-slate-300 rounded-md p-0.5" />
    </button>
  );
};
