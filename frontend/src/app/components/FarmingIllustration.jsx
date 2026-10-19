import { jsx, jsxs } from "react/jsx-runtime";
function FarmingIllustration() {
  return jsxs(
    "svg",
    {
      viewBox: "0 0 400 300",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className: "w-full max-w-md mx-auto",
      children: [
        jsx("rect", { width: "400", height: "180", fill: "#E3F2FD" }),
        jsx("circle", { cx: "350", cy: "50", r: "30", fill: "#FFC107", opacity: "0.9" }),
        jsx("rect", { y: "180", width: "400", height: "120", fill: "#8D6E63" }),
        jsx("rect", { y: "180", width: "400", height: "10", fill: "#66BB6A" }),
        jsx("ellipse", { cx: "100", cy: "180", rx: "120", ry: "40", fill: "#A0825A" }),
        jsx("ellipse", { cx: "300", cy: "180", rx: "100", ry: "35", fill: "#8D6E63" }),
        jsx("rect", { x: "20", y: "195", width: "360", height: "8", fill: "#7D5A50", opacity: "0.6" }),
        jsx("rect", { x: "20", y: "210", width: "360", height: "8", fill: "#7D5A50", opacity: "0.5" }),
        jsx("rect", { x: "20", y: "225", width: "360", height: "8", fill: "#7D5A50", opacity: "0.4" }),
        jsxs("g", { opacity: "0.8", children: [
          jsx("rect", { x: "50", y: "195", width: "3", height: "35", fill: "#FFA726" }),
          jsx("circle", { cx: "51.5", cy: "192", r: "5", fill: "#FFB74D" }),
          jsx("rect", { x: "90", y: "200", width: "3", height: "30", fill: "#FFA726" }),
          jsx("circle", { cx: "91.5", cy: "197", r: "5", fill: "#FFB74D" }),
          jsx("rect", { x: "130", y: "195", width: "3", height: "35", fill: "#FFA726" }),
          jsx("circle", { cx: "131.5", cy: "192", r: "5", fill: "#FFB74D" }),
          jsx("rect", { x: "170", y: "200", width: "3", height: "30", fill: "#FFA726" }),
          jsx("circle", { cx: "171.5", cy: "197", r: "5", fill: "#FFB74D" }),
          jsx("rect", { x: "210", y: "195", width: "3", height: "35", fill: "#FFA726" }),
          jsx("circle", { cx: "211.5", cy: "192", r: "5", fill: "#FFB74D" }),
          jsx("rect", { x: "250", y: "200", width: "3", height: "30", fill: "#FFA726" }),
          jsx("circle", { cx: "251.5", cy: "197", r: "5", fill: "#FFB74D" }),
          jsx("rect", { x: "290", y: "195", width: "3", height: "35", fill: "#FFA726" }),
          jsx("circle", { cx: "291.5", cy: "192", r: "5", fill: "#FFB74D" }),
          jsx("rect", { x: "330", y: "200", width: "3", height: "30", fill: "#FFA726" }),
          jsx("circle", { cx: "331.5", cy: "197", r: "5", fill: "#FFB74D" })
        ] }),
        jsx("rect", { x: "25", y: "145", width: "8", height: "40", fill: "#6D4C41" }),
        jsx("circle", { cx: "29", cy: "140", r: "20", fill: "#2E7D32" }),
        jsx("circle", { cx: "20", cy: "148", r: "15", fill: "#388E3C" }),
        jsx("circle", { cx: "38", cy: "148", r: "15", fill: "#388E3C" }),
        jsx("rect", { x: "320", y: "140", width: "50", height: "40", fill: "#D84315" }),
        jsx("polygon", { points: "320,140 345,115 370,140", fill: "#8D6E63" }),
        jsx("rect", { x: "335", y: "155", width: "15", height: "25", fill: "#5D4037" })
      ]
    }
  );
}
export {
  FarmingIllustration
};
