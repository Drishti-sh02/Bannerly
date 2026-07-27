import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import Sidebar from "../../../src/components/Sidebar.jsx";
import TopBar from "../../../src/components/TopBar.jsx";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  const error = useRouteError();
  if (error instanceof Response) {
    return boundary.error(error);
  }
  return (
    <div style={{ padding: "20px", color: "red", background: "#fee", border: "1px solid red" }}>
      <h2>Client Side Error</h2>
      <pre>{error?.message || String(error)}</pre>
      <pre>{error?.stack}</pre>
    </div>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
