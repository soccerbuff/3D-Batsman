import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { MetricsPanel } from './components/MetricsPanel';
import { Storyboard } from './components/Storyboard';
import { ReportSummary } from './components/ReportSummary';
import { ReportWhy } from './components/ReportWhy';
import { Timelines } from './components/Timelines';
import { getStoryboardFrames, getReportSummary, getReportWhy, getTimelines, getMeta } from './utils/reportAdapter';

const DASHBOARD_JSON = '/cover_drive_side_dashboard.json';
const METRICS_JSON = '/side_metrics.json';
const DERIVED_METRICS_JSON = '/derived_metrics.json';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState(null);
  const [derivedMetrics, setDerivedMetrics] = useState(null);

  useEffect(() => {
    fetch(DASHBOARD_JSON)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load dashboard: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(METRICS_JSON)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load metrics: ${res.status}`);
        return res.json();
      })
      .then(setMetrics)
      .catch(setMetricsError);
  }, []);

  useEffect(() => {
    fetch(DERIVED_METRICS_JSON)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load derived metrics: ${res.status}`);
        return res.json();
      })
      .then(setDerivedMetrics)
      .catch(() => setDerivedMetrics(null));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-slate-400 animate-pulse">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-6">
        <div className="bg-card border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-400 font-medium">Could not load dashboard</p>
          <p className="text-slate-500 text-sm mt-2">{error.message}</p>
          <p className="text-slate-600 text-xs mt-4">
            Ensure <code className="bg-white/5 px-1 rounded">cover_drive_side_dashboard.json</code> is in the <code className="bg-white/5 px-1 rounded">public/</code> folder.
          </p>
        </div>
      </div>
    );
  }

  const meta = getMeta(data);
  const storyboardFrames = getStoryboardFrames(data);
  const reportSummary = getReportSummary(data);
  const reportWhy = getReportWhy(data);
  const timelines = getTimelines(data);

  return (
    <div className="min-h-screen bg-dashboard-bg text-white">
      <Header meta={meta} />

      {/* Video + metrics at top (like batsman-main1) */}
      <div className="flex min-h-[600px] w-full border-b border-white/10">
        <div className="w-[70%] p-6 flex flex-col bg-[#050508]">
          <div className="flex-1 relative min-h-[500px]">
            <VideoPlayer />
          </div>
        </div>
        <div className="w-[30%] border-l border-white/10 bg-panel flex flex-col">
          <div className="p-6 border-b border-white/5 shrink-0">
            <h2 className="text-lg font-bold text-white tracking-tight">Performance Biometrics</h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <MetricsPanel metrics={metrics} error={metricsError} />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <ReportSummary summary={reportSummary} />
        <Storyboard frames={storyboardFrames} />
        <ReportWhy why={reportWhy} />
        <Timelines timelines={timelines} derivedMetrics={derivedMetrics} />
      </main>
    </div>
  );
}
