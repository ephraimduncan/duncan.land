interface ReferenceLinkProps {
  reference: string;
}

export function ReferenceLink({ reference }: ReferenceLinkProps) {
  // Parse the reference string to extract URL
  const urlMatch = reference.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const urlDirectMatch = reference.match(/https?:\/\/[^\s)]+/);

  const url = urlMatch ? urlMatch[2] : urlDirectMatch ? urlDirectMatch[0] : "";
  const textWithoutMarkdown = reference
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Replace markdown links with just text
    .replace(/\bhttps?:\/\/\S+/g, ""); // Remove raw URLs

  return (
    <div className="text-grey-700 dark:text-grey-200">
      <span className="mr-2">[1]</span> {textWithoutMarkdown}{" "}
      {url && (
        <a
          href={url}
          className="underline font-normal"
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      )}
    </div>
  );
}
