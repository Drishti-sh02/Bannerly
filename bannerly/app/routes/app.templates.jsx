import React from 'react';
import TemplatesComponent from '../../../src/pages/Templates.jsx';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Templates() {
  return (
    <div style={{ padding: '2rem' }}>
      <TemplatesComponent />
    </div>
  );
}
