import React from "react";

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: "span" | "div";
}

/**
 * Renders content that is visually hidden but available to screen readers.
 * Based on the classic visually-hidden pattern.
 */
export function VisuallyHidden({
  children,
  as: Tag = "span",
}: VisuallyHiddenProps) {
  return (
    <Tag
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0",
      }}
    >
      {children}
    </Tag>
  );
}
