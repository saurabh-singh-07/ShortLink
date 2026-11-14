
import {useEffect,useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { useAuthHeaders } from "../utils/getAuthHeaders";
import { CgSmartphone } from "react-icons/cg";
import { BsActivity, BsTablet } from "react-icons/bs";
import { CiMonitor } from "react-icons/ci";
import { BiBarChart, BiGlobe, BiTrendingUp } from "react-icons/bi";
import { LuChartNoAxesCombined, LuMousePointerClick } from "react-icons/lu";
import { FiRefreshCw } from "react-icons/fi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import type { AnalysisProps, Analytics, AnalyticsResponse, Breakdown } from "../types/AnalysisTypes";


const Analysis = ({ urls }: AnalysisProps) => {
  const [selectedUrl, setSelectedUrl] = useState("");
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const {getAuthHeaders} = useAuthHeaders();
  // Select the first URL automatically
  useEffect(() => {
    if (urls.length > 0 && !selectedUrl) {
      setSelectedUrl(urls[0]?.id);
      
    }
  }, [urls, selectedUrl]);

  const getAnalytics = async () => {
    if (!selectedUrl) return;

    try {
      setLoading(true);

      const response = await api.get<AnalyticsResponse>(
        `/api/urls/${selectedUrl}/analytics?days=${days}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      } else {
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Unable to fetch analytics.");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, [selectedUrl, days]);

  const dailyClicks = analytics?.dailyClicks || [];

  const maxClicks = Math.max(
    ...dailyClicks.map((item) => Number(item.clicks)),
    1
  );

  const totalBreakdown = (items?: Breakdown[]) =>
  (items || []).reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );
  const deviceTotal = totalBreakdown(analytics?.devices || []);

  const getPercentage = (count: number | string, total: number) =>
    total > 0 ? Math.round((Number(count) / total) * 100) : 0;

  const getDeviceIcon = (device?: string) => {
    const type = device?.toLowerCase();

    if (type === "mobile") return <CgSmartphone size={18} />;
    if (type === "tablet") return <BsTablet size={18} />;

    return <CiMonitor size={18} />;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  const selected = urls.find((url) => url.id === selectedUrl);

  if (urls.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10 dark:bg-[#0b1120]">
        <div className="mx-auto max-w-5xl rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <BiBarChart className="mx-auto mb-4 text-green-500" size={42} />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            No analytics available
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create your first short URL to start tracking clicks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 dark:bg-[#0b1120] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
              <LuChartNoAxesCombined size={20} />
              <span className="text-sm font-medium">Performance Overview</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Link Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Track clicks and understand your audience.
            </p>
          </div>

          <button
            onClick={getAnalytics}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Select short URL
            </label>

            <select
              value={selectedUrl}
              onChange={(e) => setSelectedUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800"
            >
              {urls.map((url) => (
                <option key={url.id} value={url.id}>
                  {url.title || url.short_code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Date range
            </label>

            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last 1 year</option>
            </select>
          </div>
        </div>

        {/* Selected URL */}
        {selected && (
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="text-xs font-medium text-green-700 dark:text-green-400">
                ANALYZING LINK
              </p>

              <p className="mt-1 truncate font-semibold text-green-900 dark:text-green-300">
                {selected.short_code}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {selected.original_url}
              </p>
            </div>

            <a
              href={`${import.meta.env.VITE_BACKEND_PUBLIC_URL || "http://localhost:3000"}/${selected.short_code}`}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-2 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
            >
              Visit link <FaExternalLinkAlt size={15} />
            </a>
          </div>
        )}

        {loading ? (
          <div className="grid min-h-72 place-items-center">
            <div className="text-center">
              <FiRefreshCw className="mx-auto animate-spin text-green-500" size={30} />
              <p className="mt-3 text-sm text-slate-500">
                Loading analytics...
              </p>
            </div>
          </div>
        ) : analytics ? (
          <>
            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Total Clicks"
                value={analytics.totalClicks}
                icon={<LuMousePointerClick size={21} />}
                description={`Last ${days} days`}
              />

              <StatCard
                title="Average Clicks / Day"
                value={(analytics.totalClicks / days).toFixed(1)}
                icon={<BiTrendingUp size={21} />}
                description="Daily average"
              />

              <StatCard
                title="Tracked Devices"
                value={deviceTotal}
                icon={<CiMonitor size={21} />}
                description="Device breakdown"
              />
            </div>

            {/* Daily Clicks Chart */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Click Performance</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Daily clicks over the selected period
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                  <BsActivity size={20} />
                </div>
              </div>

              {dailyClicks.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="flex h-64 min-w-125 items-end gap-2 border-b border-l border-slate-200 px-3 dark:border-slate-700">
                    {dailyClicks.map((item, index) => {
                      const clicks = Number(item.clicks);
                      const height = (clicks / maxClicks) * 100;

                      return (
                        <div
                          key={`${item.date}-${index}`}
                          className="group relative flex h-full flex-1 flex-col justify-end"
                        >
                          <div className="mb-2 text-center text-xs text-slate-500 opacity-0 transition group-hover:opacity-100">
                            {clicks}
                          </div>

                          <div
                            title={`${formatDate(item.date)}: ${clicks} clicks`}
                            style={{
                              height: `${Math.max(height, 2)}%`,
                            }}
                            className="w-full min-w-2 rounded-t-md bg-green-500 transition-all duration-300 hover:bg-green-400"
                          />

                          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-400">
                            {index % Math.max(1, Math.ceil(dailyClicks.length / 7)) === 0
                              ? formatDate(item.date)
                              : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState message="No click activity found for this period." />
              )}
            </section>

            {/* Device and Browser */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Devices */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <CiMonitor size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold">Devices</h2>
                    <p className="text-xs text-slate-500">Clicks by device type</p>
                  </div>
                </div>

                <BreakdownList
                  items={analytics.devices}
                  getName={(item) => item.device_type || "Unknown"}
                  total={deviceTotal}
                  getIcon={(item) => getDeviceIcon(item.device_type)}
                />
              </section>

              {/* Browsers */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <BiGlobe size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold">Browsers</h2>
                    <p className="text-xs text-slate-500">Clicks by browser</p>
                  </div>
                </div>

                <BreakdownList
                  items={analytics.browsers}
                  getName={(item) => item.browser || "Unknown"}
                  total={totalBreakdown(analytics.browsers)}
                />
              </section>
            </div>

            {/* Referrers */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <BiGlobe size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">Traffic Sources</h2>
                  <p className="text-xs text-slate-500">
                    Where your visitors came from
                  </p>
                </div>
              </div>

              {analytics.referrers.length > 0 ? (
                <div className="space-y-4">
                  {analytics.referrers.map((item, index) => {
                    const total = totalBreakdown(analytics.referrers);
                    const percentage = getPercentage(item.count, total);

                    return (
                      <div key={`${item.referrer}-${index}`}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="truncate text-slate-600 dark:text-slate-300">
                            {item.referrer || "Direct / Unknown"}
                          </span>
                          <span className="shrink-0 font-medium">
                            {item.count} ({percentage}%)
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            style={{ width: `${percentage}%` }}
                            className="h-full rounded-full bg-green-500 transition-all"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="No traffic source data available." />
              )}
            </section>
          </>
        ) : (
          <EmptyState message="No analytics data available." />
        )}
      </div>
    </div>
  );
};

// Reusable statistic card
function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <div className="rounded-xl bg-green-50 p-2.5 text-green-600 dark:bg-green-500/10 dark:text-green-400">
          {icon}
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold tracking-tight">
        {Number(value).toLocaleString("en-IN")}
      </h3>

      <p className="mt-2 text-xs text-slate-400">{description}</p>
    </div>
  );
}

// Reusable breakdown list
function BreakdownList({
  items,
  getName,
  total,
  getIcon,
}: {
  items: Breakdown[];
  getName: (item: Breakdown) => string;
  total: number;
  getIcon?: (item: Breakdown) => React.ReactNode;
}) {
  if (!items || items.length === 0) {
    return <EmptyState message="No data available." />;
  }

  return (
    <div className="space-y-5">
      {items.map((item, index) => {
        const percentage = total > 0
          ? Math.round((Number(item.count) / total) * 100)
          : 0;

        return (
          <div key={`${getName(item)}-${index}`}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 text-sm">
                {getIcon?.(item)}
                <span className="truncate text-slate-600 dark:text-slate-300">
                  {getName(item)}
                </span>
              </div>

              <span className="shrink-0 text-sm font-medium">
                {item.count} ({percentage}%)
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                style={{ width: `${percentage}%` }}
                className="h-full rounded-full bg-green-500 transition-all"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid min-h-32 place-items-center text-center">
      <div>
        <FaCalendarDays className="mx-auto mb-2 text-slate-400" size={25} />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}

export default Analysis;
