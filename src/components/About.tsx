import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 sm:p-12">
        <div className="flex items-center justify-start gap-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 transition-colors6"
          >
            <ChevronLeft className="w-5 h-5 border border:bg-slate-300 rounded-md p-0.5" />
          </button>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            About
          </h2>
        </div>

        <p className="text-gray-700 text-lg sm:text-xl">
          Numerical Utility for Money Analysis transforming your numbers into
          actionable insights.
        </p>
        <div className="space-y-4 text-gray-800 text-base sm:text-lg">
          <p>
            NUMA is designed to help you track, analyze, and visualize your
            financial or numerical data efficiently. NUMA provides a clean and
            insightful interface.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            NUMA
          </h1>
          <h1 className="text-base font-semibold tracking-[3px] flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-emerald-900 text-white rounded-full w-10 h-10">
              <span className="text-xl pl-4.5 tracking-[17px] font-bold select-none">
                NU
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};
