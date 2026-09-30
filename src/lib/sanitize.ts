import sanitizeHtml from "sanitize-html";

export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "u",
      "span",
      "iframe",
      "figure",
      "figcaption",
      "aside",
      "colgroup",
      "col",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "data-width", "data-align", "class"],
      iframe: ["src", "allow", "allowfullscreen", "title", "width", "height", "frameborder"],
      aside: ["class", "data-type", "data-variant"],
      "*": ["class", "data-type", "data-variant", "data-width", "data-align", "colspan", "rowspan"],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
