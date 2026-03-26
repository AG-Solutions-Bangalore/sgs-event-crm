import Login from "@/app/auth/login";
import NotFound from "@/app/errors/not-found";
import Settings from "@/app/setting/setting";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import LoadingBar from "@/components/loader/loading-bar";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";
import EventScannerPage from "@/app/event/EventScannerPage";
import EventList from "@/app/event/EventList";
import EventAttendMember from "@/app/event/EventAttendMember";
import EventTrackList from "@/app/eventtrack/EventTrackList";
import EventDetailsPage from "@/app/eventtrack/EventDetailsPage";

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>
        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/event"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EventScannerPage />
              </Suspense>
            }
          />
          <Route
            path="/event-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EventList />
              </Suspense>
            }
          />
          <Route
            path="/event-attend-member/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EventAttendMember />
              </Suspense>
            }
          />
          <Route
            path="/event-track"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EventTrackList />
              </Suspense>
            }
          />
          <Route
            path="/event-details"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EventDetailsPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRoutes;
