"use client";

import Image from "@tiptap/extension-image";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

async function uploadImage(file: File, alt = "") {
  const form = new FormData();
  form.set("file", file);
  if (alt) form.set("alt", alt);
  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  if (!response.ok) throw new Error("Upload impossible");
  return (await response.json()) as { url: string };
}

function EditorImageView({ node, selected, deleteNode, updateAttributes }: NodeViewProps) {
  const src = String(node.attrs.src || "");
  const alt = String(node.attrs.alt || "");
  const width = String(node.attrs.width || "full");
  const align = String(node.attrs.align || "center");
  const replaceRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function replace(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const uploaded = await uploadImage(file, alt);
      updateAttributes({ src: uploaded.url });
    } finally {
      setBusy(false);
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }

  return (
    <NodeViewWrapper
      as="figure"
      className={`editor-image editor-image--${width} editor-image--${align}${selected ? " is-selected" : ""}`}
      data-drag-handle
    >
      <div className="editor-image__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} draggable={false} />
        {selected ? (
          <div className="editor-image__toolbar" contentEditable={false}>
            <input
              ref={replaceRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void replace(event.target.files?.[0])}
            />
            <button type="button" className="editor-image__btn" onClick={() => replaceRef.current?.click()} disabled={busy}>
              <ImagePlus className="h-3.5 w-3.5" />
              Remplacer
            </button>
            <button type="button" className="editor-image__btn" onClick={() => updateAttributes({ width: "full" })} title="Largeur pleine">
              100%
            </button>
            <button type="button" className="editor-image__btn" onClick={() => updateAttributes({ width: "medium" })} title="Largeur moyenne">
              70%
            </button>
            <button type="button" className="editor-image__btn" onClick={() => updateAttributes({ width: "small" })} title="Largeur petite">
              40%
            </button>
            <button type="button" className="editor-image__btn" onClick={() => updateAttributes({ align: "left" })} title="Gauche">
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="editor-image__btn" onClick={() => updateAttributes({ align: "center" })} title="Centre">
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="editor-image__btn" onClick={() => updateAttributes({ align: "right" })} title="Droite">
              <AlignRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="editor-image__delete"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                deleteNode();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </button>
          </div>
        ) : null}
      </div>
      {selected ? (
        <input
          contentEditable={false}
          value={alt}
          onChange={(event) => updateAttributes({ alt: event.target.value })}
          placeholder="Texte alternatif"
          className="editor-image__alt"
        />
      ) : null}
    </NodeViewWrapper>
  );
}

export const SelectableImage = Image.extend({
  name: "image",
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: null },
      title: { default: null },
      width: {
        default: "full",
        parseHTML: (element) => element.getAttribute("data-width") || "full",
        renderHTML: (attributes) => ({ "data-width": attributes.width || "full" }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({ "data-align": attributes.align || "center" }),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { width, align, ...rest } = HTMLAttributes;
    return [
      "img",
      {
        ...rest,
        "data-width": width || "full",
        "data-align": align || "center",
        class: `article-img article-img--${width || "full"} article-img--${align || "center"}`,
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(EditorImageView);
  },
});
