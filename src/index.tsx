import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";

import { Provider } from "react-redux";
import { store } from "./redux";

import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: "https://ec915b3499944f26bf280b07214186bb@o1194835.ingest.sentry.io/6382394",
    normalizeDepth: 10,
    integrations: [new BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    ignoreErrors: ["ResizeObserver loop limit exceeded"]
  });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={enUS}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
