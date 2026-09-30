"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

export type CalloutVariant = "tip" | "warning" | "cta";

function CalloutView({ node, updateAttributes, selected }: NodeViewProps) {
  const variant = (node.attrs.variant || "tip") as CalloutVariant;
  return (
    <NodeViewWrapper
      as="aside"
      className={`editor-callout editor-callout--${variant}${selected ? " is-selected" : ""}`}
      data-variant={variant}
    >
      <div className="editor-callout__bar" contentEditable={false}>
        <select
          value={variant}
          onChange={(event) => updateAttributes({ variant: event.target.value })}
          className="editor-callout__select"
        >
          <option value="tip">Astuce</option>
          <option value="warning">Attention</option>
          <option value="cta">CTA</option>
        </select>
      </div>
      <NodeViewContent className="editor-callout__body" />
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs?: { variant?: CalloutVariant }) => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      variant: {
        default: "tip",
        parseHTML: (element) => element.getAttribute("data-variant") || "tip",
        renderHTML: (attributes) => ({ "data-variant": attributes.variant }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'aside[data-type="callout"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes, { "data-type": "callout", class: "callout" }), 0];
  },
  addCommands() {
    return {
      setCallout:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { variant: attrs?.variant || "tip" },
            content: [{ type: "paragraph" }],
          }),
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },
});
