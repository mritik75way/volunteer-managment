import { type Badge } from '../../features/auth/auth.slice';
import { Tooltip } from 'antd';

interface BadgeListProps {
  badges: Badge[];
}

export const BadgeList = ({ badges }: BadgeListProps) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
        <p className="text-slate-500 text-sm">No badges earned yet. Keep volunteering!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {badges.map((badge) => (
        <Tooltip key={badge.id} title={`${badge.name}: ${badge.description}`}>
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-help group">
            <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">
              {badge.icon}
            </div>
            <span className="text-xs font-medium text-slate-700 text-center leading-tight">
              {badge.name}
            </span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
