import { useNavigate } from "react-router-dom";

export const ContentMain = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <div>
        <h1>Content here</h1>
      </div>
    </div>
  );
};
