import { useNavigate, useParams } from "react-router-dom";
import { useContent } from "../context/content/useContent";
import { ChevronLeft } from "lucide-react";

export const ContentMain = () => {
  const { id } = useParams<{ id: string }>();
  const { contents } = useContent();
  const navigate = useNavigate();

  const idNum = Number(id);
  if (isNaN(idNum)) return <p>Invalid id</p>;

  const content = contents.find((c) => c.id === Number(id));
  if (!content) return <p>Content not found</p>;

  return (
    <div className="bg-red-900 w-full   ">
      <button onClick={() => navigate(-1)}>
        <ChevronLeft />
      </button>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">{content.title}</h1>
        <p className="mt-2 text-gray-700">{content.description}</p>
        <span className="text-gray-500 text-sm">ID: {content.id}</span>
      </div>
    </div>
  );
};
