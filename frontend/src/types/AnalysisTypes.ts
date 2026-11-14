export interface UrlOption {
  id: string;
  short_code: string;
  original_url: string;
  title?: string | null;
}

export interface AnalysisProps {
  urls: UrlOption[];
}

export interface DailyClick {
  date: string;
  clicks: number | string;
}

export interface Breakdown {
  device_type?: string;
  browser?: string;
  referrer?: string;
  count: number | string;
}

export interface Analytics {
  url: {
    id: string;
    short_code: string;
    original_url: string;
    title?: string | null;
  };
  period: number;
  totalClicks: number;
  dailyClicks: DailyClick[];
  devices: Breakdown[];
  browsers: Breakdown[];
  referrers: Breakdown[];
}

export interface AnalyticsResponse {
  success: boolean;
  analytics: Analytics;
}
