export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function prepareArticleHtml(html: string) {
  const headings: TocItem[] = [];
  let index = 0;

  const withIds = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level, attrs, content) => {
    const text = String(content)
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return _match;
    const id = `section-${++index}`;
    headings.push({ id, text, level: Number(level) as 2 | 3 });
    const cleanAttrs = String(attrs).replace(/\s*id=(["'])[\s\S]*?\1/i, "");
    return `<h${level}${cleanAttrs} id="${id}">${content}</h${level}>`;
  });

  return { html: withIds, headings };
}
