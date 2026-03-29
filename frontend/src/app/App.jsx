import { jsx, jsxs } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { AppProvider } from "./contexts/AppContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
function App() {
  return /* @__PURE__ */ jsxs(AppProvider, { children: [
    /* @__PURE__ */ jsx(RouterProvider, { router }),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center" })
  ] });
}
export {
  App as default
};
