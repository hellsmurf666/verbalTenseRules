import React from "react";
import { createRoot } from "react-dom/client";

import "./tweaks-panel.jsx";
import "./conjugator.jsx";
import "./tenses.jsx";
import Comparison from "./comparison.jsx";

const root = createRoot(document.getElementById("root"));
root.render(<Comparison />);
