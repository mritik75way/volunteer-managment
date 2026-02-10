import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store/store';
import { setCredentials, logout, type User } from '../../features/auth/auth.slice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  credentials: 'include', 
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error?.status === 401) {
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    
    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data as { user: User; accessToken: string }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Opportunities', 'Enrollments', 'Volunteers', 'Stats', 'Announcements', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    refresh: builder.query({
      query: () => '/auth/refresh',
    }),
    
    getOpportunities: builder.query({
      query: () => '/opportunities',
      providesTags: ['Opportunities'],
    }),
    createOpportunity: builder.mutation({
      query: (data) => ({
        url: '/opportunities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Opportunities'],
    }),
    enrollInShift: builder.mutation({
      query: ({ opportunityId, shiftId }) => ({
        url: `/opportunities/${opportunityId}/enroll/${shiftId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Enrollments', 'Opportunities', 'Stats'],
    }),
    getMyEnrollments: builder.query({
      query: () => '/opportunities/my-enrollments',
      providesTags: ['Enrollments'],
    }),
    getOpportunityEnrollments: builder.query({
      query: (opportunityId: string) => `/opportunities/${opportunityId}/enrollments`,
      providesTags: ['Enrollments'],
    }),
    updateEnrollmentStatus: builder.mutation({
      query: ({ opportunityId, enrollmentId, status }) => ({
        url: `/opportunities/${opportunityId}/enrollments/${enrollmentId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Enrollments', 'Stats'],
    }),
    downloadCertificate: builder.query({
      query: (enrollmentId: string) => `/opportunities/certificate/${enrollmentId}`,
    }),
    
    getMyStats: builder.query({
      query: () => '/opportunities/my-stats',
      providesTags: ['Stats'],
    }),
    getAdminStats: builder.query({
      query: () => '/opportunities/admin-stats',
      providesTags: ['Stats'],
    }),
    
    getVolunteers: builder.query({
      query: () => '/auth/volunteers',
      providesTags: ['Volunteers'],
    }),
    exportVolunteers: builder.query({
      query: () => ({
        url: '/auth/export-volunteers',
        responseHandler: (response) => response.text(),
      }),
    }),
    getVolunteerHistory: builder.query({
      query: (volunteerId: string) => `/opportunities/volunteer-history/${volunteerId}`,
      providesTags: ['Enrollments'],
    }),
    
    getAnnouncements: builder.query({
      query: (opportunityId: string) => `/opportunities/${opportunityId}/announcements`,
      providesTags: ['Announcements'],
    }),
    createAnnouncement: builder.mutation({
      query: ({ opportunityId, message }) => ({
        url: `/opportunities/${opportunityId}/announcements`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Announcements'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useLazyRefreshQuery,
  useGetOpportunitiesQuery,
  useCreateOpportunityMutation,
  useEnrollInShiftMutation,
  useGetMyEnrollmentsQuery,
  useGetOpportunityEnrollmentsQuery,
  useUpdateEnrollmentStatusMutation,
  useLazyDownloadCertificateQuery,
  useGetMyStatsQuery,
  useGetAdminStatsQuery,
  useGetVolunteersQuery,
  useLazyExportVolunteersQuery,
  useGetVolunteerHistoryQuery,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
} = apiSlice;
