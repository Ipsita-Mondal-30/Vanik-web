import { jsx, jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";
import { seedMockData } from "../utils/mockData";
function RootLayout() {
  useEffect(() => {
    seedMockData();
  }, []);
  return jsxs("div", { className: "min-h-screen bg-background", children: [
    jsx(Navbar, {}),
    jsx(Outlet, {})
  ] });
}
export {
  RootLayout
};
