import React from "react";
import Link from "next/link";
import { Arrow } from "./Arrow";

export function ExternalLink({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="block sm:inline-block sm:mr-2">
      <span className="flex items-center justify-center gap-1 my-2 text-grey-500 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100 cursor-pointer">
        <Arrow size={20} />
        <span>{text}</span>
      </span>
    </Link>
  );
}
