import { useState } from 'react';
import { Avatar, Tag, Space, Select, Button, message, Divider } from 'antd';
import { BadgeList } from '../features/profile/components/BadgeList';
import { UserOutlined, MailOutlined, IdcardOutlined, BulbOutlined, ClockCircleOutlined, SafetyCertificateOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import type { Availability } from '../features/auth/auth.slice';
import { useAppSelector } from '../app/store/hooks';
import api from '../config/api';

const SKILL_OPTIONS = ['Teaching', 'Coding', 'First Aid', 'Event Planning', 'Cooking', 'Logistics'];
const DAY_OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [availability, setAvailability] = useState(user?.availability || []);

  if (!user) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.patch('/auth/update-profile', { skills, availability });
      message.success('Profile updated successfully');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = { pending: 'orange', passed: 'success', failed: 'error' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-linear-to-r from-indigo-500 to-violet-500"></div>
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="p-1 bg-white rounded-full">
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                className="bg-indigo-600 border-4 border-white shadow-sm"
              />
            </div>
            {user.role === 'volunteer' && (
              <Tag color={statusColors[user.backgroundCheckStatus || 'pending']} className="mb-2">
                <Space>
                  <SafetyCertificateOutlined /> 
                  Background: {(user.backgroundCheckStatus || 'pending').toUpperCase()}
                </Space>
              </Tag>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Tag color="blue" className="m-0 border-0 bg-blue-50 text-blue-700 capitalize">
                  {user.role}
                </Tag>
                <span className="text-slate-500 text-sm">Member since {dayjs(user.createdAt).format('MMMM YYYY')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <MailOutlined /> {user.email}
                  </p>
               </div>
               <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                   <p className="flex items-center gap-2 text-slate-700">
                    <IdcardOutlined /> <span className="capitalize">{user.role}</span>
                  </p>
               </div>
            </div>

            {user.role === 'volunteer' && (
              <>
                 <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <TrophyOutlined className="text-indigo-500" /> Adjustments & Achievements
                    </h3>
                    <BadgeList badges={user.badges} />
                 </div>

                <Divider className="my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <BulbOutlined className="text-indigo-500" /> Skills
                    </h3>
                    <Select
                      mode="multiple"
                      className="w-full"
                      placeholder="Select your skills"
                      value={skills}
                      onChange={setSkills}
                      options={SKILL_OPTIONS.map(s => ({ label: s, value: s }))}
                    />
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <ClockCircleOutlined className="text-indigo-500" /> General Availability
                    </h3>
                    <Select
                      mode="multiple"
                      className="w-full"
                      placeholder="Select days you are free"
                      value={availability.map((a: Availability) => a.day)}
                      onChange={(days) => {
                        const newAvailability = days.map((day: string) => ({
                          day,
                          startTime: '09:00',
                          endTime: '17:00'
                        }));
                        setAvailability(newAvailability);
                      }}
                      options={DAY_OPTIONS.map(d => ({ label: d, value: d }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="primary" 
                    onClick={handleUpdate} 
                    loading={loading}
                    size="large"
                    className="bg-indigo-600 hover:bg-indigo-500"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};