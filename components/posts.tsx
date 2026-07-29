import { allPosts, allThoughts } from "content-collections";
import { formatter } from "@/lib/utils";

import { Link } from "@tanstack/react-router";

type PostCategory = "thoughts" | "posts" | "archive";
type PostListItem = (typeof allPosts)[number] | (typeof allThoughts)[number];

const POST_SECTIONS = {
  thoughts: {
    href: "/thoughts",
    title: "thoughts",
    posts: allThoughts,
  },
  posts: {
    href: "/blog",
    title: "blog",
    posts: allPosts.filter((post) => !post.archived),
  },
  archive: {
    href: "/archive",
    title: "archive",
    posts: allPosts.filter((post) => post.archived),
  },
} satisfies Record<
  PostCategory,
  {
    href: string;
    title: string;
    posts: readonly PostListItem[];
  }
>;

interface PostProps {
  category: PostCategory;
}

function byDateDescending(a: PostListItem, b: PostListItem) {
  return b.date.getTime() - a.date.getTime();
}

export const Posts = ({ category }: PostProps) => {
  const section = POST_SECTIONS[category];
  const posts = section.posts.toSorted(byDateDescending);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <Link to={section.href} className="flex justify-between">
        <h2 className="py-2 text-2xl font-medium tracking-tight text-balance dark:text-grey-100">
          {section.title}
        </h2>
      </Link>

      <div className="divide-y divide-separator">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={post.slug}
            className="flex w-full justify-between gap-4 py-3 dark:text-grey-100"
          >
            <p className="text-pretty">{post.title}</p>
            <p className="shrink-0 text-foreground-muted">{formatter.date(post.date)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
