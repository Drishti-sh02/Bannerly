import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import { AppProvider as CustomAppProvider } from "../../src/context/AppContext.jsx";
import { AppProvider as ShopifyAppProvider } from "@shopify/shopify-app-react-router/react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import enTranslations from "@shopify/polaris/locales/en.json";
import appStyles from "../../src/App.css?url";
import indexStyles from "../../src/index.css?url";

export const loader = async () => {
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: indexStyles },
  { rel: "stylesheet", href: appStyles },
];

export default function App() {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
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
        <ShopifyAppProvider embedded apiKey={data.apiKey}>
          <PolarisProvider i18n={enTranslations}>
            <CustomAppProvider>
              <Outlet />
            </CustomAppProvider>
          </PolarisProvider>
        </ShopifyAppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
