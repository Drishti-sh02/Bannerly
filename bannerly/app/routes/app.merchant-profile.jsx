import React from 'react';
import { authenticate } from '../shopify.server';
import MerchantProfilePage from '../../../src/pages/MerchantProfile.jsx';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function MerchantProfile() {
  return <MerchantProfilePage />;
}
