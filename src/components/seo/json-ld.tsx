export function JsonLd({ data }: { data: Record<string, unknown> }): JSX.Element {
  // SECURITY: JSON.stringify does not escape "</script>" or other HTML-significant
  // characters. Escaping them prevents CMS-authored content (titles, names) from
  // breaking out of the script tag and injecting markup (stored XSS). The block is
  // parsed as JSON (type="application/ld+json"), so escaping <, >, & is sufficient.
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
