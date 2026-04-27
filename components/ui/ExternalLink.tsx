import { Arrow } from "./Arrow";

export function ExternalLink({ href, text }: { href: string; text: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block sm:inline-block sm:mr-2"
    >
      <span className="my-2 flex items-center justify-center gap-1 text-grey-500 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100">
        <Arrow size={20} />
        <span>{text}</span>
      </span>
    </a>
  );
}
