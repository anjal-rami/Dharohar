import React from "react";

export interface ModelViewerElementProps extends React.HTMLAttributes<HTMLElement> {
  src?: string | undefined;
  "ios-src"?: string | undefined;
  alt?: string | undefined;
  ar?: boolean | undefined;
  "ar-modes"?: string | undefined;
  "ar-scale"?: string | undefined;
  "camera-controls"?: boolean | undefined;
  "auto-rotate"?: boolean | undefined;
  "auto-rotate-delay"?: string | number | undefined;
  "rotation-per-second"?: string | undefined;
  "shadow-intensity"?: string | number | undefined;
  "shadow-softness"?: string | number | undefined;
  "environment-image"?: string | undefined;
  exposure?: string | number | undefined;
  "touch-action"?: string | undefined;
  "camera-orbit"?: string | undefined;
  "field-of-view"?: string | undefined;
  loading?: "auto" | "lazy" | "eager" | undefined;
  reveal?: "auto" | "interaction" | "manual" | undefined;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<ModelViewerElementProps, HTMLElement>;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<ModelViewerElementProps, HTMLElement>;
    }
  }
}
