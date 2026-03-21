import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <h1 className="text-2xl font-medium">Page not found</h1>
      <p className="text-grey-500 dark:text-grey-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="text-sm underline underline-offset-2 decoration-grey-300 hover:decoration-grey-600 dark:decoration-grey-600 dark:hover:decoration-grey-300"
      >
        Go home
      </Link>
    </div>
  );
}
