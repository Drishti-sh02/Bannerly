import React from 'react';
import CreateAnnouncementComponent from '../../../src/pages/CreateAnnouncement.jsx';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function EditAnnouncement() {
  return (
    <div style={{ padding: '2rem' }}>
      <CreateAnnouncementComponent />
    </div>
  );
}
