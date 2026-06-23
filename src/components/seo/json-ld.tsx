// Server component — renders a <script type="application/ld+json"> tag.
// Never add "use client" here; this component must stay a server component
// so it is included in the initial HTML and crawlable by search engines.

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any> | Record<string, any>[];
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint: this is safe — schema is built from controlled inputs only
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
