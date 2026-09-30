"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Columns3,
  ExternalLink,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Quote,
  Redo2,
  Rows3,
  Sparkles,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
  Video,
} from "lucide-react";
import { Callout } from "@/components/admin/editor-callout";
import { SelectableImage } from "@/components/admin/editor-image";
import { createSlashExtension } from "@/components/admin/editor-slash";
import { plainTextFromHtml } from "@/lib/blocks";
import { cn, readingMinutes, slugify } from "@/lib/utils";
import "tippy.js/dist/tippy.css";

export type LinkItem = { title: string; href: string };

type Option = { id: string; name: string };
type ArticlePayload = {
  id?: string;
  locale?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
  categoryId?: string | null;
  authorId?: string | null;
  tagIds: string[];
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
};

async function uploadImage(file: File, alt = "") {
  const form = new FormData();
  form.set("file", file);
  if (alt) form.set("alt", alt);
  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  if (!response.ok) throw new Error("Upload impossible");
  return (await response.json()) as { url: string };
}

export function ArticleEditor({
  initial,
  categories,
  authors,
  tags,
  linkItems = [],
}: {
  initial: ArticlePayload;
  categories: Option[];
  authors: Option[];
  tags: Option[];
  linkItems?: LinkItem[];
}) {
  const router = useRouter();
  const [article, setArticle] = useState(initial);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkQuery, setLinkQuery] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pickImageRef = useRef(() => {});
  pickImageRef.current = () => imageInputRef.current?.click();
  const slashExtension = useMemo(() => createSlashExtension(() => pickImageRef.current()), []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false, underline: false }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      SelectableImage.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ width: 640, height: 360 }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Écrivez l'article… Tapez / pour insérer un bloc",
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Callout,
      slashExtension,
    ],
    content: initial.contentHtml || "<p></p>",
    editorProps: {
      attributes: { class: "prose-article min-h-[420px] px-4 py-3 focus:outline-none" },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
        if (!images.length) return false;
        event.preventDefault();
        void (async () => {
          setUploading(true);
          try {
            for (const file of images) {
              const { url } = await uploadImage(file);
              const { schema } = view.state;
              const node = schema.nodes.image?.create({ src: url, alt: "" });
              if (!node) continue;
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
              const tr = view.state.tr;
              if (typeof pos === "number") tr.insert(pos, node);
              else tr.replaceSelectionWith(node);
              view.dispatch(tr);
            }
            setMessage("Image(s) ajoutée(s).");
          } catch {
            setMessage("Échec de l'upload.");
          } finally {
            setUploading(false);
          }
        })();
        return true;
      },
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files;
        if (!files?.length) return false;
        const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
        if (!images.length) return false;
        event.preventDefault();
        void (async () => {
          setUploading(true);
          try {
            for (const file of images) {
              const { url } = await uploadImage(file);
              const node = view.state.schema.nodes.image?.create({ src: url, alt: "" });
              if (!node) continue;
              view.dispatch(view.state.tr.replaceSelectionWith(node));
            }
            setMessage("Image collée.");
          } catch {
            setMessage("Échec du collage.");
          } finally {
            setUploading(false);
          }
        })();
        return true;
      },
    },
  });

  const [selectionVersion, setSelectionVersion] = useState(0);
  const html = editor?.getHTML() || article.contentHtml;
  const imageSelected = useMemo(() => Boolean(editor?.isActive("image")), [editor, selectionVersion]);
  const tableSelected = useMemo(() => Boolean(editor?.isActive("table")), [editor, selectionVersion]);
  const stats = useMemo(() => {
    const text = plainTextFromHtml(html);
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return { words, minutes: readingMinutes(text), headings: extractToc(html) };
  }, [html]);
  const checks = useMemo(
    () => analyze(html, article.seoTitle || article.title, article.seoDescription || article.excerpt, article.focusKeyword || ""),
    [html, article],
  );
  const filteredLinks = useMemo(() => {
    const q = linkQuery.trim().toLowerCase();
    if (!q) return linkItems.slice(0, 12);
    return linkItems.filter((item) => item.title.toLowerCase().includes(q) || item.href.toLowerCase().includes(q)).slice(0, 12);
  }, [linkItems, linkQuery]);

  useEffect(() => {
    if (!editor) return;
    const refresh = () => setSelectionVersion((value) => value + 1);
    editor.on("selectionUpdate", refresh);
    editor.on("transaction", refresh);
    return () => {
      editor.off("selectionUpdate", refresh);
      editor.off("transaction", refresh);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !article.id) return;
    const timer = window.setTimeout(() => {
      void persist(false);
    }, 2000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, article.title, article.excerpt, article.seoTitle, article.seoDescription, article.coverUrl]);

  async function persist(manual: boolean) {
    if (!editor) return;
    setSaving(true);
    const contentHtml = editor.getHTML();
    const body = {
      title: article.title,
      slug: article.slug || slugify(article.title),
      excerpt: article.excerpt,
      contentHtml,
      contentJson: editor.getJSON(),
      coverUrl: article.coverUrl || "",
      coverAlt: article.coverAlt || "",
      categoryId: article.categoryId || "",
      authorId: article.authorId || "",
      tagIds: article.tagIds,
      status: article.status,
      publishedAt: article.publishedAt || "",
      seoTitle: article.seoTitle || "",
      seoDescription: article.seoDescription || "",
      focusKeyword: article.focusKeyword || "",
      canonicalUrl: article.canonicalUrl || "",
      ogTitle: article.ogTitle || "",
      ogDescription: article.ogDescription || "",
      ogImage: article.ogImage || "",
      readingHint: readingMinutes(plainTextFromHtml(contentHtml)),
    };
    const response = await fetch(article.id ? `/api/admin/articles/${article.id}` : "/api/admin/articles", {
      method: article.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!response.ok) {
      setMessage("Enregistrement impossible.");
      return;
    }
    const saved = (await response.json()) as { id: string };
    if (!article.id) {
      router.replace(`/admin/articles/${saved.id}`);
      return;
    }
    if (manual) setMessage("Enregistré.");
  }

  async function handleContentImage(file: File | undefined) {
    if (!file || !editor) return;
    setUploading(true);
    setMessage("");
    try {
      const alt = window.prompt("Texte alternatif (accessibilité)") || "";
      const { url } = await uploadImage(file, alt);
      editor.chain().focus().setImage({ src: url, alt }).run();
      setMessage("Image ajoutée.");
    } catch {
      setMessage("Échec de l'upload.");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }

  async function handleCoverImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const { url } = await uploadImage(file, article.coverAlt || "");
      setArticle((current) => ({ ...current, coverUrl: url }));
      setMessage("Image de couverture mise à jour.");
    } catch {
      setMessage("Échec de l'upload couverture.");
    } finally {
      setUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  function applyLink(href: string) {
    if (!editor || !href) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
    setLinkQuery("");
  }

  function openLinkPicker() {
    setLinkOpen(true);
  }

  const shellClass = fullscreen
    ? "fixed inset-0 z-50 overflow-auto bg-[#efebe3] p-4 md:p-8"
    : "grid gap-6 xl:grid-cols-[1fr_300px]";

  return (
    <div className={shellClass}>
      <div className={cn("space-y-4", fullscreen && "mx-auto w-full max-w-4xl")}>
        <input
          value={article.title}
          onChange={(event) => setArticle({ ...article, title: event.target.value, slug: article.slug || slugify(event.target.value) })}
          placeholder="Titre"
          className="w-full border border-paper-ink/15 bg-white px-3 py-3 font-serif text-3xl"
        />

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleContentImage(event.target.files?.[0])}
        />

        {!preview && editor ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-paper-ink/10 bg-white p-2">
              <IconTool title="Annuler" onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 className="h-4 w-4" />
              </IconTool>
              <IconTool title="Rétablir" onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 className="h-4 w-4" />
              </IconTool>
              <Sep />
              <IconTool title="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="h-4 w-4" />
              </IconTool>
              <IconTool title="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 className="h-4 w-4" />
              </IconTool>
              <IconTool title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-4 w-4" />
              </IconTool>
              <IconTool title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-4 w-4" />
              </IconTool>
              <IconTool title="Souligné" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="h-4 w-4" />
              </IconTool>
              <Sep />
              <IconTool title="Liste" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="h-4 w-4" />
              </IconTool>
              <IconTool title="Numéros" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="h-4 w-4" />
              </IconTool>
              <IconTool title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="h-4 w-4" />
              </IconTool>
              <IconTool title="Séparateur" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus className="h-4 w-4" />
              </IconTool>
              <IconTool title="Lien" active={editor.isActive("link")} onClick={openLinkPicker}>
                <Link2 className="h-4 w-4" />
              </IconTool>
              <IconTool title={uploading ? "Upload…" : "Image"} onClick={() => imageInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4" />
              </IconTool>
              <IconTool
                title="Vidéo"
                onClick={() => {
                  const src = window.prompt("URL YouTube");
                  if (src) editor.chain().focus().setYoutubeVideo({ src }).run();
                }}
              >
                <Video className="h-4 w-4" />
              </IconTool>
              <IconTool title="Tableau" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                <Columns3 className="h-4 w-4" />
              </IconTool>
              <IconTool title="Encadré" onClick={() => editor.chain().focus().setCallout({ variant: "cta" }).run()}>
                <Sparkles className="h-4 w-4" />
              </IconTool>
              <IconTool title="Aligner gauche" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                <AlignLeft className="h-4 w-4" />
              </IconTool>
              <IconTool title="Centrer" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                <AlignCenter className="h-4 w-4" />
              </IconTool>
              <Sep />
              <IconTool title={fullscreen ? "Quitter plein écran" : "Plein écran"} onClick={() => setFullscreen((v) => !v)}>
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </IconTool>
              {imageSelected ? (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteSelection().run()}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Image
                </button>
              ) : null}
            </div>

            {tableSelected ? (
              <div className="flex flex-wrap gap-1 rounded-xl border border-paper-ink/10 bg-white px-2 py-1.5 text-xs">
                <button type="button" className="rounded-md border px-2 py-1" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Plus className="mr-1 inline h-3 w-3" />
                  Colonne
                </button>
                <button type="button" className="rounded-md border px-2 py-1" onClick={() => editor.chain().focus().deleteColumn().run()}>
                  − Colonne
                </button>
                <button type="button" className="rounded-md border px-2 py-1" onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <Rows3 className="mr-1 inline h-3 w-3" />
                  Ligne
                </button>
                <button type="button" className="rounded-md border px-2 py-1" onClick={() => editor.chain().focus().deleteRow().run()}>
                  − Ligne
                </button>
                <button
                  type="button"
                  className="rounded-md border border-red-200 px-2 py-1 text-red-700"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  Supprimer tableau
                </button>
              </div>
            ) : null}

            <BubbleMenu
              editor={editor}
              className="flex gap-1 rounded-full border border-paper-ink/10 bg-white p-1 shadow-lg"
            >
              <IconTool title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-3.5 w-3.5" />
              </IconTool>
              <IconTool title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-3.5 w-3.5" />
              </IconTool>
              <IconTool title="Lien" active={editor.isActive("link")} onClick={openLinkPicker}>
                <Link2 className="h-3.5 w-3.5" />
              </IconTool>
              <IconTool title="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="h-3.5 w-3.5" />
              </IconTool>
            </BubbleMenu>
          </div>
        ) : null}

        <div className="rounded-2xl border border-paper-ink/10 bg-white">
          {preview ? (
            <div className="prose-article px-5 py-6 md:px-8" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-paper-muted">
          <p>
            {stats.words} mots · ~{stats.minutes} min de lecture · tapez <kbd className="rounded border px-1">/</kbd> pour
            insérer
          </p>
          {uploading ? <p>Upload en cours…</p> : null}
        </div>

        <label className="block text-sm">
          Extrait
          <textarea
            value={article.excerpt}
            onChange={(event) => setArticle({ ...article, excerpt: event.target.value })}
            rows={3}
            className="mt-1 w-full border border-paper-ink/15 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-paper-muted">{article.excerpt.length}/400</span>
        </label>
      </div>

      {!fullscreen ? (
        <aside className="space-y-4">
          <div className="border border-paper-ink/10 bg-white p-4 text-sm">
            <p className="font-medium">Publication</p>
            <select
              value={article.status}
              onChange={(event) => setArticle({ ...article, status: event.target.value as ArticlePayload["status"] })}
              className="mt-2 h-10 w-full border px-2"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
              <option value="SCHEDULED">Programmé</option>
            </select>
            <input
              type="datetime-local"
              value={article.publishedAt || ""}
              onChange={(event) => setArticle({ ...article, publishedAt: event.target.value })}
              className="mt-2 h-10 w-full border px-2"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => void persist(true)} className="bg-ink px-3 py-2 text-ivory">
                {saving ? "…" : "Enregistrer"}
              </button>
              <button type="button" onClick={() => setPreview((value) => !value)} className="border px-3 py-2">
                {preview ? "Éditer" : "Aperçu"}
              </button>
              {article.slug ? (
                <a
                  href={`/${article.locale || "fr"}/blog/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border px-3 py-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Voir
                </a>
              ) : null}
            </div>
            {message ? <p className="mt-2 text-xs">{message}</p> : <p className="mt-2 text-xs text-paper-muted">Sauvegarde automatique après la création.</p>}
          </div>

          <div className="border border-paper-ink/10 bg-white p-4 text-sm">
            <p className="font-medium">Sommaire</p>
            {stats.headings.length === 0 ? (
              <p className="mt-2 text-xs text-paper-muted">Ajoutez des H2/H3 pour générer le sommaire.</p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-xs">
                {stats.headings.map((item) => (
                  <li key={`${item.level}-${item.text}`} className={item.level === 3 ? "ps-3 text-paper-muted" : "font-medium"}>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-paper-ink/10 bg-white p-4 text-sm">
            <p className="font-medium">Image de couverture</p>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void handleCoverImage(event.target.files?.[0])}
            />
            {article.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.coverUrl} alt={article.coverAlt || ""} className="mt-3 aspect-[16/10] w-full rounded-lg object-cover" />
            ) : (
              <p className="mt-2 text-xs text-paper-muted">Aucune image. Elle apparaît en tête de l&apos;article.</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => coverInputRef.current?.click()} className="border px-3 py-1.5 text-xs" disabled={uploading}>
                {article.coverUrl ? "Changer" : "Ajouter"}
              </button>
              {article.coverUrl ? (
                <button
                  type="button"
                  onClick={() => setArticle({ ...article, coverUrl: "" })}
                  className="border border-red-200 px-3 py-1.5 text-xs text-red-700"
                >
                  Retirer
                </button>
              ) : null}
            </div>
            <input
              value={article.coverAlt || ""}
              onChange={(event) => setArticle({ ...article, coverAlt: event.target.value })}
              placeholder="Texte alternatif"
              className="mt-2 h-10 w-full border px-2"
            />
          </div>

          <div className="border border-paper-ink/10 bg-white p-4 text-sm">
            <p className="font-medium">Classement</p>
            <input
              value={article.slug}
              onChange={(event) => setArticle({ ...article, slug: slugify(event.target.value) })}
              className="mt-2 h-10 w-full border px-2"
              placeholder="slug"
            />
            <select
              value={article.categoryId || ""}
              onChange={(event) => setArticle({ ...article, categoryId: event.target.value })}
              className="mt-2 h-10 w-full border px-2"
            >
              <option value="">Catégorie</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              value={article.authorId || ""}
              onChange={(event) => setArticle({ ...article, authorId: event.target.value })}
              className="mt-2 h-10 w-full border px-2"
            >
              <option value="">Auteur</option>
              {authors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="mt-2 space-y-1">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={article.tagIds.includes(tag.id)}
                    onChange={(event) => {
                      const tagIds = event.target.checked
                        ? [...article.tagIds, tag.id]
                        : article.tagIds.filter((id) => id !== tag.id);
                      setArticle({ ...article, tagIds });
                    }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          <div className="border border-paper-ink/10 bg-white p-4 text-sm">
            <p className="font-medium">SEO</p>
            <p className="mt-1 text-xs text-paper-muted">Aide à la relecture. Ce n&apos;est pas une garantie de position Google.</p>
            <SeoField
              label="SEO title"
              value={article.seoTitle || ""}
              onChange={(value) => setArticle({ ...article, seoTitle: value })}
              ideal={[45, 65]}
            />
            <SeoField
              label="Meta description"
              value={article.seoDescription || ""}
              onChange={(value) => setArticle({ ...article, seoDescription: value })}
              ideal={[120, 160]}
              textarea
            />
            <SeoField
              label="Mot-clé"
              value={article.focusKeyword || ""}
              onChange={(value) => setArticle({ ...article, focusKeyword: value })}
            />
            <SeoField
              label="Canonical URL"
              value={article.canonicalUrl || ""}
              onChange={(value) => setArticle({ ...article, canonicalUrl: value })}
            />
            <SeoField label="OG title" value={article.ogTitle || ""} onChange={(value) => setArticle({ ...article, ogTitle: value })} />
            <SeoField
              label="OG description"
              value={article.ogDescription || ""}
              onChange={(value) => setArticle({ ...article, ogDescription: value })}
              textarea
            />
            <SeoField label="OG image URL" value={article.ogImage || ""} onChange={(value) => setArticle({ ...article, ogImage: value })} />
            <ul className="mt-3 space-y-1 text-xs">
              {checks.map((check) => (
                <li key={check.label} className={check.ok ? "text-emerald-800" : "text-amber-800"}>
                  {check.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : (
        <div className="mx-auto mt-4 flex max-w-4xl flex-wrap gap-2">
          <button type="button" onClick={() => void persist(true)} className="bg-ink px-3 py-2 text-sm text-ivory">
            {saving ? "…" : "Enregistrer"}
          </button>
          <button type="button" onClick={() => setFullscreen(false)} className="border bg-white px-3 py-2 text-sm">
            Quitter plein écran
          </button>
        </div>
      )}

      {linkOpen ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4" onClick={() => setLinkOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <p className="font-medium">Insérer un lien</p>
            <input
              autoFocus
              value={linkQuery}
              onChange={(event) => setLinkQuery(event.target.value)}
              placeholder="Rechercher un article ou coller une URL"
              className="mt-3 h-10 w-full border px-3"
            />
            <ul className="mt-3 max-h-56 space-y-1 overflow-auto text-sm">
              {filteredLinks.map((item) => (
                <li key={item.href}>
                  <button type="button" className="w-full rounded-lg px-3 py-2 text-start hover:bg-paper" onClick={() => applyLink(item.href)}>
                    <span className="block font-medium">{item.title}</span>
                    <span className="block text-xs text-paper-muted">{item.href}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="bg-ink px-3 py-2 text-sm text-ivory"
                onClick={() => {
                  const href = linkQuery.trim().startsWith("http") || linkQuery.trim().startsWith("/") ? linkQuery.trim() : "";
                  if (href) applyLink(href);
                  else {
                    const custom = window.prompt("URL du lien", linkQuery);
                    if (custom) applyLink(custom);
                  }
                }}
              >
                Utiliser l&apos;URL
              </button>
              <button type="button" className="border px-3 py-2 text-sm" onClick={() => setLinkOpen(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function IconTool({
  title,
  onClick,
  children,
  active,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition",
        active ? "border-ink bg-ink text-ivory" : "border-transparent hover:border-paper-ink/15 hover:bg-paper",
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-0.5 h-5 w-px bg-paper-ink/10" />;
}

function SeoField({
  label,
  value,
  onChange,
  ideal,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  ideal?: [number, number];
  textarea?: boolean;
}) {
  const len = value.length;
  const ok = !ideal || (len >= ideal[0] && len <= ideal[1]);
  return (
    <label className="mt-2 block text-xs text-paper-muted">
      {label}
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={2} className="mt-1 w-full border px-2 py-1.5 text-sm text-paper-ink" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full border px-2 text-sm text-paper-ink" />
      )}
      <span className={cn("mt-0.5 block", ok ? "text-emerald-700" : "text-amber-700")}>
        {len} caractères{ideal ? ` · idéal ${ideal[0]}–${ideal[1]}` : ""}
      </span>
    </label>
  );
}

function extractToc(html: string) {
  const matches = html.matchAll(/<h([23])[^>]*>(.*?)<\/h\1>/gi);
  return Array.from(matches).map((match) => ({
    level: Number(match[1]),
    text: match[2].replace(/<[^>]+>/g, "").trim(),
  })).filter((item) => item.text);
}

function analyze(html: string, title: string, description: string, keyword: string) {
  const text = plainTextFromHtml(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const images = html.match(/<img\b[^>]*>/gi) || [];
  const missingAlt = images.filter((tag) => !/\balt="[^"]+"/i.test(tag) || /\balt=""/.test(tag)).length;
  const lower = text.toLowerCase();
  const key = keyword.trim().toLowerCase();
  return [
    { ok: title.length >= 45 && title.length <= 65, label: `SEO title : ${title.length} caractères` },
    { ok: description.length >= 120 && description.length <= 160, label: `Meta description : ${description.length} caractères` },
    { ok: !key || lower.includes(key), label: key ? "Mot-clé présent dans le texte" : "Mot-clé non renseigné" },
    { ok: (html.match(/<h2\b/gi) || []).length > 0, label: "Au moins un H2" },
    { ok: words >= 300, label: `${words} mots` },
    { ok: images.length === 0 || missingAlt === 0, label: missingAlt ? `${missingAlt} image(s) sans alt` : "Alt des images" },
    { ok: /href="\//.test(html), label: "Lien interne" },
    { ok: /href="https?:/.test(html), label: "Lien externe" },
  ];
}
