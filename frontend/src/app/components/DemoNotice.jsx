import { jsx, jsxs } from "react/jsx-runtime";
import { Info } from "lucide-react";
import { Card, CardContent } from "./ui/card";
function DemoNotice() {
  return jsx(Card, { className: "bg-primary/5 border-primary/20", children: jsx(CardContent, { className: "p-4 sm:p-5", children: jsxs("div", { className: "flex items-start gap-3", children: [
    jsx(Info, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }),
    jsxs("div", { className: "flex-1", children: [
      jsx("h4", { className: "font-semibold text-primary mb-1", children: "Demo Mode" }),
      jsx("p", { className: "text-sm text-foreground/80", children: "This app includes sample posts and bids. Create an account to start trading!" })
    ] })
  ] }) }) });
}
export {
  DemoNotice
};
