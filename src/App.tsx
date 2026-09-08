import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useAppStore } from '@/store/appStore';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Discover = lazy(() => import('@/pages/Discover'));
const Leads = lazy(() => import('@/pages/Leads'));
const LeadDetail = lazy(() => import('@/pages/LeadDetail'));
const Outreach = lazy(() => import('@/pages/Outreach'));
const FollowUps = lazy(() => import('@/pages/FollowUps'));
const Insights = lazy(() => import('@/pages/Insights'));
const MapView = lazy(() => import('@/pages/MapView'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

function ThemeInit() {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

function PageFallback() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ThemeInit />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="discover" element={<Discover />} />
              <Route path="leads" element={<Leads />} />
              <Route path="leads/:id" element={<LeadDetail />} />
              <Route path="outreach" element={<Outreach />} />
              <Route path="follow-ups" element={<FollowUps />} />
              <Route path="insights" element={<Insights />} />
              <Route path="map" element={<MapView />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  );
}
