import { getUserBalance } from "@/services/api/user.api";
import useSWR from "swr";

export default function Dashboard() {
  console.log("Dashboard Rendered");
  const { data, isLoading, error } = useSWR("user-balance", getUserBalance);

  console.log({ data });

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-bold">📊 Dashboard Page</h1>
    </div>
  );
}
