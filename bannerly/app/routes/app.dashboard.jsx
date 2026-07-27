import React from 'react';
import DashboardComponent from '../../../src/pages/Dashboard.jsx';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function DashboardRoute() {
  return <DashboardComponent />;
}
