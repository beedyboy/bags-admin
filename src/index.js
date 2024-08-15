import "react-app-polyfill/ie11";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <HashRouter>
            <ScrollToTop>
                <QueryClientProvider client={queryClient}>
                    <Toaster reverseOrder={false} gutter={8}>
                        {(t) => (
                            <ToastBar toast={t}>
                                {({ icon, message }) => (
                                    <>
                                        <span onClick={() => t.type !== "loading" && toast.dismiss(t.id)}> {icon}</span>
                                        {message}
                                    </>
                                )}
                            </ToastBar>
                        )}
                    </Toaster>
                    <App />
                </QueryClientProvider>
            </ScrollToTop>
        </HashRouter>
    </React.StrictMode>
);
