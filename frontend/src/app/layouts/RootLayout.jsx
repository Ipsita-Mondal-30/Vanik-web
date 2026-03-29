import { jsx, jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";
import { seedMockData } from "../utils/mockData";
function RootLayout() {
  useEffect(() => {
    seedMockData();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
export {
  RootLayout
};
