import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Sales",
      data: [10, 20, 15, 30, 25],
      borderColor: "rgb(14, 165, 233)",
      backgroundColor: "rgba(14, 165, 233, 0.2)",
    },
  ],
};

export const MyChart = () => (
  <div className="p-4 w-1/4 h-1/4 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-lg">
    <Line data={data} />
  </div>
);
