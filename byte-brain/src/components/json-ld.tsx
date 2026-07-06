/** Renders a JSON-LD script tag. Server component; safe by design. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe for a ld+json context.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
