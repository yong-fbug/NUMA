import { PlusCircle, Bell, XSquare } from "lucide-react";
import { useState } from "react";
import { useContent } from "../ContentProvider";

export const Header = () => {
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { addContent } = useContent();

  const addContentButton = () => {
    setShowAdd((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addContent(title, description);
    setTitle("");
    setDescription("");
    console.log("success", useContent);
    setShowAdd(false);
  };
  return (
    <div className="flex w-full bg-slate-100 shadow-sm border-b border-white">
      {/* Left branding */}
      <div className="flex items-center px-6 border-r border-white h-16">
        <h1 className="text-xl font-bold tracking-widest text-slate-800">
          NUMA
        </h1>
      </div>

      {/* Right icons */}
      <div className="flex flex-1 items-center justify-center space-x-4 px-6 h-16">
        <PlusCircle
          onClick={addContentButton}
          className="w-6 h-6 text-slate-700 hover:text-emerald-500 cursor-pointer transition-colors"
        />
        <Bell className="w-6 h-6 text-slate-700 hover:text-amber-500 cursor-pointer transition-colors" />
      </div>

      {/*modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={addContentButton}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full relative flex flex-col gap-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-lg text-slate-800">CONTENT</h1>
              <XSquare
                className="text-gray-600 hover:text-gray-800"
                onClick={addContentButton}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center justify-center gap-4">
                <input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full
              focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  placeholder="short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full
              focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex items-center justify-end p-2 mt-4">
                <button
                  type="submit"
                  className="text-white bg-emerald-600 hover:bg-emerald-600/90 p-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
