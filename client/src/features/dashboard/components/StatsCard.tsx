import { ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useGetMyStatsQuery } from '../../../shared/api/api.slice';

export const StatsCards = () => {
  const { data, isLoading } = useGetMyStatsQuery(undefined);
  const stats = data?.data?.stats || { totalHours: 0, eventsAttended: 0 };

  const cards = [
    {
      title: "Total Volunteer Hours",
      value: stats.totalHours,
      precision: 1,
      icon: <ClockCircleOutlined />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      title: "Events Attended",
      value: stats.eventsAttended,
      icon: <TrophyOutlined />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, idx) => (
        <div 
          key={idx}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between transition-all hover:shadow-md"
        >
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
            <div className="text-3xl font-bold text-slate-800">
              {isLoading ? "-" : (
                card.precision ? Number(card.value).toFixed(card.precision) : card.value
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${card.bg} ${card.color} text-xl border ${card.borderColor}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};