// src/pages/settings/Settings.tsx
import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui';

const Settings: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader title="User Preferences" />
        <CardBody>
          <p className="text-gray-700">
            Settings options will appear here. You can add notification preferences,
            account security settings, theme toggles, and more.
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Privacy & Security" />
        <CardBody>
          <p className="text-gray-700">
            Manage your privacy, data sharing, and security options here.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;
