'use client';

import { useState } from 'react';
import NavBar from '../../components/NavBar';
import AccountManagement from '../../components/AccountManagement';

type NotificationSetting = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

type PrivacySetting = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

export default function Settings() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'email-updates',
      name: 'Email Updates',
      description: 'Receive updates about your move progress via email',
      enabled: true,
    },
    {
      id: 'sms-notifications',
      name: 'SMS Notifications',
      description: 'Get text messages for important updates',
      enabled: false,
    },
    {
      id: 'service-alerts',
      name: 'Service Alerts',
      description: 'Notifications about service provider status changes',
      enabled: true,
    },
    {
      id: 'reminder-notifications',
      name: 'Reminders',
      description: 'Get reminded about pending address updates',
      enabled: true,
    },
  ]);

  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 'share-progress',
      name: 'Share Progress',
      description: 'Allow service providers to share update progress',
      enabled: true,
    },
    {
      id: 'save-history',
      name: 'Save Move History',
      description: 'Save your move history for future reference',
      enabled: true,
    },
    {
      id: 'analytics',
      name: 'Usage Analytics',
      description: 'Help us improve by sharing anonymous usage data',
      enabled: false,
    },
  ]);

  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleNotificationToggle = (id: string) => {
    setNotificationSettings(settings =>
      settings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handlePrivacyToggle = (id: string) => {
    setPrivacySettings(settings =>
      settings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleProfileEdit = () => {
    if (isEditing) {
      setUserProfile(editedProfile);
    }
    setIsEditing(!isEditing);
  };

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    // TODO: Implement password change logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
  };

  const handleAccountDelete = async (password: string) => {
    // TODO: Implement account deletion logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          {/* Profile Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userProfile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userProfile.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userProfile.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleProfileEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              {notificationSettings.map(setting => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(setting.id)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        setting.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              {privacySettings.map(setting => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle(setting.id)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        setting.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Management</h2>
            <AccountManagement
              onPasswordChange={handlePasswordChange}
              onAccountDelete={handleAccountDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 