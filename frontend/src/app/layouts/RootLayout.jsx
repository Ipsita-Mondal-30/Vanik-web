import { jsx, jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
function RootLayout() {
  return jsxs("div", { className: "min-h-screen bg-background", children: [
    jsx(Navbar, {}),
    jsx(Outlet, {})
  ] });
}
export {
  RootLayout
};
