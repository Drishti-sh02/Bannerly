import React from 'react';
import SettingsComponent from '../../../src/pages/Settings.jsx';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Settings() {
  return (
    <div style={{ padding: '2rem' }}>
      <SettingsComponent />
    </div>
  );
}
