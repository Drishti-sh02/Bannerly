import React from 'react';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Help() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="h1">Help & Support</h1>
      <p className="text-muted">This page is under construction.</p>
    </div>
  );
}
