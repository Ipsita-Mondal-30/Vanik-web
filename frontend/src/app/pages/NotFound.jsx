import { jsx } from "react/jsx-runtime";
import { Navigate } from "react-router";
function NotFound() {
  return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
}
export {
  NotFound
};
