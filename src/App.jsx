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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-white border border-red-300 rounded-xl p-6 max-w-md text-center shadow-sm">
          <p className="text-red-600 font-medium">Could not load dashboard</p>
          <p className="text-gray-600 text-sm mt-2">{error.message}</p>
          <p className="text-gray-500 text-xs mt-4">
            Ensure <code className="bg-white border border-border-dim px-1 rounded">cover_drive_side_dashboard.json</code> is in the <code className="bg-white border border-border-dim px-1 rounded">public/</code> folder.
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
    <div className="min-h-screen bg-white text-gray-800">
      <Header meta={meta} />

      {/* Video + metrics at top (like batsman-main1) */}
      <div className="flex min-h-[600px] w-full border-b border-border-dim bg-white">
        <div className="w-[70%] p-6 flex flex-col bg-white">
          <div className="flex-1 relative min-h-[500px]">
            <VideoPlayer />
          </div>
        </div>
        <div className="w-[30%] border-l border-border-dim bg-white flex flex-col shadow-sm">
          <div className="p-6 border-b border-border-dim shrink-0">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Performance Biometrics</h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <MetricsPanel metrics={metrics} error={metricsError} />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8 bg-white">
        <ReportSummary summary={reportSummary} why={reportWhy} />
        <Storyboard frames={storyboardFrames} />
        <ReportWhy why={reportWhy} />
        <Timelines timelines={timelines} derivedMetrics={derivedMetrics} />
      </main>
    </div>
  );
}
