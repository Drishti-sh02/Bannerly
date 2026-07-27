import React from 'react';
import AnnouncementsComponent from '../../../src/pages/Announcements.jsx';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Announcements() {
  return (
    <div style={{ padding: '2rem' }}>
      <AnnouncementsComponent />
    </div>
  );
}
