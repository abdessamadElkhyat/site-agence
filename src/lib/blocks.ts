import type { ArticleBlock } from "@/types/content";

type DocNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
  text?: string;
};

export function blocksToHtml(blocks: ArticleBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "p") return `<p>${block.text}</p>`;
      if (block.type === "h2") return `<h2>${block.text}</h2>`;
      if (block.type === "h3") return `<h3>${block.text}</h3>`;
      if (block.type === "quote") return `<blockquote><p>${block.text}</p></blockquote>`;
      return `<ul>${block.items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    })
    .join("");
}

export function blocksToDoc(blocks: ArticleBlock[]): DocNode {
  return {
    type: "doc",
    content: blocks.map((block) => {
      if (block.type === "h2" || block.type === "h3") {
        return {
          type: "heading",
          attrs: { level: block.type === "h2" ? 2 : 3 },
          content: [{ type: "text", text: block.text }],
        };
      }
      if (block.type === "quote") {
        return {
          type: "blockquote",
          content: [{ type: "paragraph", content: [{ type: "text", text: block.text }] }],
        };
      }
      if (block.type === "ul") {
        return {
          type: "bulletList",
          content: block.items.map((item) => ({
            type: "listItem",
            content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
          })),
        };
      }
      return { type: "paragraph", content: [{ type: "text", text: block.text }] };
    }),
  };
}

export function plainTextFromHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
