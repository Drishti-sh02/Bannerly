import React from 'react';
import BillingComponent from '../../../src/pages/Billing.jsx';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Billing() {
  return (
    <div style={{ padding: '2rem' }}>
      <BillingComponent />
    </div>
  );
}
