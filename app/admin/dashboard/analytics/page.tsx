import { getAnalytics } from "@/app/actions/admin";
import AnalyticsDashboard from "./analytics-client";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [week, month, year] = await Promise.all([
    getAnalytics("week"),
    getAnalytics("month"),
    getAnalytics("year"),
  ]);

  return <AnalyticsDashboard week={week} month={month} year={year} />;
}
