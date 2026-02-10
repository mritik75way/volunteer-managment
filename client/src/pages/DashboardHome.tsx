import { useAppSelector } from '../app/store/hooks';
import { StatsCards } from '../features/dashboard/components/StatsCard';
import { AdminStats } from '../features/dashboard/components/AdminStats';

export const DashboardHome = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-500 text-lg">
          {user?.role === 'volunteer' 
            ? 'Track your contribution and impact below.' 
            : 'Overview of the opportunities you are managing.'}
        </p>
      </div>

      {user?.role === 'volunteer' && <StatsCards />}
      {user?.role === 'admin' && <AdminStats />}
    </div>
  );
};