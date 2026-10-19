import { jsx } from "react/jsx-runtime";
import { Navigate } from "react-router";
function NotFound() {
  return jsx(Navigate, { to: "/", replace: true });
}
export {
  NotFound
};
