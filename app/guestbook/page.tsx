import { Loader } from "lucide-react";
import { Suspense } from "react";
import { PostsList } from "./posts-list";

/**
 * Guestbook page - simplified with React Query
 * No server-side data fetching needed
 */
export default function GuestbookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <PostsList />
    </Suspense>
  );
}
