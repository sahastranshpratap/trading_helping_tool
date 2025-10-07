import React, { lazy, Suspense, memo } from "react";
import Layout from "./layout";

// Lazy-loaded page components
const Content = lazy(() => import("./content"));
const AnalyticsPage = lazy(() => import("./analytics"));
const TradeSuggestions = lazy(() => import("./trade-suggestions"));
const Calendar = lazy(() => import("../../pages/Calendar/Calendar"));
const Profile = lazy(() => import("./profile"));
const SettingsPage = lazy(() => import("./settings"));

// Loading component
const PageLoading = () => (
  <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

// Memoized placeholder content to avoid unnecessary re-renders
const PlaceholderContent = memo(({ type }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left">
          {type.charAt(0).toUpperCase() + type.slice(1)} Page
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This is a placeholder for the {type} page content. 
          You can implement the actual content for this page later.
        </p>
      </div>
    </div>
  );
});

PlaceholderContent.displayName = "PlaceholderContent";

function Dashboard({ pageType = "dashboard" }) {
  // Render different content based on page type
  const renderContent = () => {
    switch (pageType) {
      case "dashboard":
        return (
          <Suspense fallback={<PageLoading />}>
            <Content />
          </Suspense>
        );
      case "analytics":
        return (
          <Suspense fallback={<PageLoading />}>
            <AnalyticsPage />
          </Suspense>
        );
      case "journal":
        return <PlaceholderContent type="journal" />;
      case "trades":
        return <PlaceholderContent type="trades" />;
      case "suggestions":
        return (
          <Suspense fallback={<PageLoading />}>
            <TradeSuggestions trades={[]} className="w-full" />
          </Suspense>
        );
      case "calendar":
        return (
          <Suspense fallback={<PageLoading />}>
            <Calendar />
          </Suspense>
        );
      case "profile":
        return (
          <Suspense fallback={<PageLoading />}>
            <Profile />
          </Suspense>
        );
      case "settings":
        return (
          <Suspense fallback={<PageLoading />}>
            <SettingsPage />
          </Suspense>
        );
      case "help":
        return <PlaceholderContent type="help" />;
      default:
        return (
          <Suspense fallback={<PageLoading />}>
            <Content />
          </Suspense>
        );
    }
  };

  return <Layout>{renderContent()}</Layout>;
}

export default memo(Dashboard); 