import { Home, PieChart, Settings } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="bg-slate-100 w-20 h-screen flex flex-col items-center py-6 shadow-inner border-r border-white">
      <div className="flex flex-col space-y-6">
        <button className="hover:bg-slate-200 p-2 rounded-full transition-colors">
          <Home className="w-5 h-5 text-slate-700 hover:text-emerald-500" />
        </button>
        <button className="hover:bg-slate-200 p-2 rounded-full transition-colors">
          <PieChart className="w-5 h-5 text-slate-700 hover:text-amber-500" />
        </button>
        <button className="hover:bg-slate-200 p-2 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-slate-700 hover:text-sky-500" />
        </button>
      </div>
    </div>
  );
};
