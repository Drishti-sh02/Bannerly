import React from 'react';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 className="h1">404 - Page Not Found</h1>
      <p className="text-muted" style={{ marginTop: '1rem' }}>
        We couldn't find the page you're looking for inside the app.
      </p>
    </div>
  );
}
