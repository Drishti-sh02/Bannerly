import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import { AppProvider as CustomAppProvider } from "../../src/context/AppContext.jsx";
import { AppProvider as ShopifyAppProvider } from "@shopify/shopify-app-react-router/react";
import appStyles from "../../src/App.css?url";
import indexStyles from "../../src/index.css?url";

export const loader = async () => {
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export const links = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: indexStyles },
];

export default function App() {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" data-api-key={data?.apiKey}></script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <ShopifyAppProvider isEmbeddedApp apiKey={data.apiKey}>
          <CustomAppProvider>
            <Outlet />
          </CustomAppProvider>
        </ShopifyAppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
