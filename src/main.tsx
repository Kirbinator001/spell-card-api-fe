import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ConfirmProvider } from "material-ui-confirm";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { SnackBar } from "./components/Snackbar";
import { NotificationProvider } from "./contexts/NotificationProvider";
import { routeTree } from "./routeTree.gen";

export const mutationCache = new MutationCache({
  onSuccess: () => {
    queryClient.invalidateQueries();
  },
});
export const queryClient = new QueryClient({ mutationCache: mutationCache });

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ConfirmProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            <SnackBar />
          </NotificationProvider>
        </ConfirmProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
