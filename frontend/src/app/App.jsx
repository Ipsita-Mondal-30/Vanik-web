import { jsx, jsxs } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { AppProvider } from "./contexts/AppContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
function App() {
  return jsxs(AppProvider, { children: [
    jsx(RouterProvider, { router }),
    jsx(Toaster, { position: "top-center" })
  ] });
}
export {
  App as default
};
