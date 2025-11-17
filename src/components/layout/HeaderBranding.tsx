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

      <h1 className="text-base font-semibold tracking-[3px] flex items-center gap-2">
        <span className="inline-flex items-center justify-center bg-emerald-900 text-white rounded-full w-8 h-8">
          <span className="text-lg pl-2.5 tracking-[11px] font-bold select-none">
            NU
          </span>
        </span>
        {/* <span>MA</span> */}
      </h1>
    </div>
  );
};
