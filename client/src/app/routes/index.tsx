import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import { DashboardLayout } from "../../shared/components/layout/DashboardLayout";
import { ProtectedRoute } from "../../shared/components/layout/ProtectedRoute";
import { ErrorPage } from "../../shared/components/ui/ErrorPage";
import { LoadingFallback } from "../../shared/components/ui/LoadingFallback";

const LoginForm = lazy(() => import("../../features/auth/components/LoginForm").then(m => ({ default: m.LoginForm })));
const RegisterForm = lazy(() => import("../../features/auth/components/RegisterForm").then(m => ({ default: m.RegisterForm })));
const OpportunitiesPage = lazy(() => import("../../pages/Opportunities/OpportunitiesPage").then(m => ({ default: m.OpportunitiesPage })));
const MySchedule = lazy(() => import("../../pages/Opportunities/MySchedule").then(m => ({ default: m.MySchedule })));
const DashboardHome = lazy(() => import("../../pages/DashboardHome").then(m => ({ default: m.DashboardHome })));
const VolunteersPage = lazy(() => import("../../pages/VolunteersPage").then(m => ({ default: m.VolunteersPage })));
const ProfilePage = lazy(() => import("../../pages/ProfilePage").then(m => ({ default: m.ProfilePage })));

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterForm />
          </Suspense>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <DashboardHome />
                  </Suspense>
                ),
              },
              {
                path: "opportunities",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <OpportunitiesPage />
                  </Suspense>
                ),
              },
              {
                path: "my-schedule",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <MySchedule />
                  </Suspense>
                ),
              },
              {
                path: "volunteers",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <VolunteersPage />
                  </Suspense>
                ),
              },
              {
                path: "profile",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <ProfilePage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
