declare module "sanitize-html" {
  type Attributes = Record<string, string>;
  interface Options {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedIframeHostnames?: string[];
    transformTags?: Record<string, unknown>;
  }
  interface Sanitize {
    (dirty: string, options?: Options): string;
    defaults: { allowedTags: string[] };
    simpleTransform(tagName: string, attribs: Attributes): unknown;
  }
  const sanitizeHtml: Sanitize;
  export default sanitizeHtml;
}
