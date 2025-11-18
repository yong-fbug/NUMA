import { useParams } from "react-router-dom";
import { useContent } from "../context/content/useContent";
import { HistoryButton } from "../components/HistoryButton";
import { CardCalculator } from "../content/CardCalculator";

export const ContentMain = () => {
  const { id } = useParams<{ id: string }>();
  const { contents } = useContent();

  const idNum = Number(id);
  if (isNaN(idNum)) return <p>Invalid id</p>;

  const content = contents.find((c) => c.id === Number(id));
  if (!content) return <p>Content not found</p>;

  return (
    <div className=" w-full   ">
      <div className="flex items-center gap-2">
        <HistoryButton />
        <h1 className="text-2xl font-bold">{content.title}</h1>
      </div>

      <div className="bg-white">
        <CardCalculator />
      </div>
    </div>
  );
};
