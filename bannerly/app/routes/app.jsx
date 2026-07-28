import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <>
      <ui-nav-menu>
        <a href="/app/dashboard" rel="home">Dashboard</a>
        <a href="/app/templates">Create Banner</a>
        <a href="/app/announcements">Announcements</a>
        <a href="/app/billing">Billing</a>
        <a href="/app/settings">Settings</a>
      </ui-nav-menu>
      <Outlet />
    </>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  const error = useRouteError();
  console.error("ErrorBoundary caught:", error);
  
  if (error instanceof Error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>App Error</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return boundary.error(error);
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
