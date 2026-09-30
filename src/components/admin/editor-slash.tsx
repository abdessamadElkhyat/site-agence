"use client";

import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import {
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Sparkles,
  Table,
  Video,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export type SlashItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (props: { editor: import("@tiptap/react").Editor; range: { from: number; to: number } }) => void;
};

function buildItems(onPickImage: () => void): SlashItem[] {
  return [
    {
      title: "Titre H2",
      description: "Section principale",
      icon: <Heading2 className="h-4 w-4" />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
    },
    {
      title: "Titre H3",
      description: "Sous-section",
      icon: <Heading3 className="h-4 w-4" />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
    },
    {
      title: "Liste",
      description: "Puces",
      icon: <List className="h-4 w-4" />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      title: "Liste numérotée",
      description: "Étapes",
      icon: <ListOrdered className="h-4 w-4" />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      title: "Citation",
      description: "Mettre en avant",
      icon: <Quote className="h-4 w-4" />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
      title: "Séparateur",
      description: "Ligne horizontale",
      icon: <Minus className="h-4 w-4" />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    },
    {
      title: "Image",
      description: "Importer un fichier",
      icon: <ImageIcon className="h-4 w-4" />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        onPickImage();
      },
    },
    {
      title: "Vidéo YouTube",
      description: "Coller une URL",
      icon: <Video className="h-4 w-4" />,
      command: ({ editor, range }) => {
        const src = window.prompt("URL YouTube");
        if (!src) return;
        editor.chain().focus().deleteRange(range).setYoutubeVideo({ src }).run();
      },
    },
    {
      title: "Tableau",
      description: "3 × 3",
      icon: <Table className="h-4 w-4" />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      title: "Encadré / CTA",
      description: "Astuce, alerte ou appel à l'action",
      icon: <Sparkles className="h-4 w-4" />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setCallout({ variant: "tip" }).run(),
    },
  ];
}

type ListProps = {
  items: SlashItem[];
  command: (item: SlashItem) => void;
};

type ListHandle = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

const SlashList = forwardRef<ListHandle, ListProps>(function SlashList({ items, command }, ref) {
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setIndex((value) => (value + items.length - 1) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === "ArrowDown") {
        setIndex((value) => (value + 1) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === "Enter") {
        const item = items[index];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  if (!items.length) {
    return <div className="slash-menu__empty">Aucun résultat</div>;
  }

  return (
    <div className="slash-menu">
      {items.map((item, i) => (
        <button
          key={item.title}
          type="button"
          className={`slash-menu__item${i === index ? " is-active" : ""}`}
          onClick={() => command(item)}
        >
          <span className="slash-menu__icon">{item.icon}</span>
          <span>
            <span className="slash-menu__title">{item.title}</span>
            <span className="slash-menu__desc">{item.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
});

export function createSlashExtension(onPickImage: () => void) {
  const items = buildItems(onPickImage);

  return Extension.create({
    name: "slashCommand",
    addOptions() {
      return {
        suggestion: {
          char: "/",
          startOfLine: true,
          items: ({ query }) =>
            items.filter(
              (item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase()),
            ),
          render: () => {
            let component: ReactRenderer<ListHandle> | null = null;
            let popup: TippyInstance[] | null = null;

            return {
              onStart: (props) => {
                component = new ReactRenderer(SlashList, {
                  props: {
                    ...props,
                    command: (item: SlashItem) => {
                      item.command({ editor: props.editor, range: props.range });
                    },
                  },
                  editor: props.editor,
                });

                if (!props.clientRect) return;

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },
              onUpdate: (props) => {
                component?.updateProps({
                  ...props,
                  command: (item: SlashItem) => {
                    item.command({ editor: props.editor, range: props.range });
                  },
                });
                popup?.[0]?.setProps({
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                });
              },
              onKeyDown: (props) => {
                if (props.event.key === "Escape") {
                  popup?.[0]?.hide();
                  return true;
                }
                return component?.ref?.onKeyDown(props) ?? false;
              },
              onExit: () => {
                popup?.[0]?.destroy();
                component?.destroy();
              },
            };
          },
        } satisfies Partial<SuggestionOptions>,
      };
    },
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
}
