import { time as t } from "@webstudio-is/sdk/normalize.css";
import { props as e } from "./__generated__/time.props.js";
const r = {
  category: "localization",
  description: "Converts machine-readable date and time to a human-readable format.",
  contentModel: {
    category: "instance",
    children: []
  },
  presetStyle: {
    time: t
  },
  initialProps: [
    "datetime",
    "language",
    "country",
    "dateStyle",
    "timeStyle",
    "format"
  ],
  props: e
};
export {
  r as meta
};
