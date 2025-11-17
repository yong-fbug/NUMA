import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../context/content/useContent";

export const ContentHolder = () => {
  const { contents, deleteContent } = useContent();

  const navigate = useNavigate();
  return (
    <div>
      {/* <h1>Content:</h1> */}
      {contents.length === 0 ? (
        <p>No content</p>
      ) : (
        <ul className="flex flex-wrap gap-6">
          {contents.map((c) => (
            <li key={c.id} className="mt-2 w-72">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20  shadow-[0_0_20px_rgba(0,0,0,0.15)] p-6 rounded-2xl flex flex-col gap-4 hover:shadow-[0_0_25px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-900 tracking-wide">
                  {c.title.charAt(0).toUpperCase() + c.title.slice(1)}
                </h2>

                <span className="text-gray-500 text-sm font-medium">
                  ID: {c.id}
                </span>

                <p className="text-gray-700 leading-snug">
                  {c.description.charAt(0).toUpperCase() +
                    c.description.slice(1)}
                </p>

                <div className="flex items-center justify-between mt-2 bg-white/20 p-3 rounded-xl">
                  <span className="font-semibold text-gray-800">Result</span>

                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <ChevronUp size={16} /> 20,000
                    </span>
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <ChevronDown size={16} /> 10,000
                    </span>
                  </div>
                </div>

                  <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this content?")
                      ) {
                        deleteContent(c.id);
                      }
                    }}
                    className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/content/${c.id}`)}
                    className="px-3 py-1 text-sm rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
