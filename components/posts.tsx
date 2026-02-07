import { allPosts, allThoughts } from "content-collections";
import { formatter } from "@/lib/utils";

import { Link as NextViewTransition } from "next-view-transitions";
import React from "react";

interface PostProps {
  category: "thoughts" | "posts" | "archive";
}

const getPosts = (category: "thoughts" | "posts" | "archive") => {
  if (category === "thoughts") {
    return allThoughts;
  } else if (category === "archive") {
    return allPosts.filter((post) => post.archived);
  } else {
    return allPosts.filter((post) => !post.archived);
  }
};

export const Posts = ({ category }: PostProps) => {
  const posts = getPosts(category).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const Seperator = () => (
    <div className="border-border border-t border-grey-900" />
  );

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <NextViewTransition
        href={`/${category === "posts" ? "blog" : category}`}
        className="flex justify-between"
      >
        <h2 className="py-2 text-2xl font-medium tracking-tighter dark:text-grey-100">
          {category === "posts" ? "blog" : category}{" "}
          {/* {posts.length > 0 && `(${posts.length})`} */}
        </h2>
      </NextViewTransition>

      {posts.map((post) => {
        return (
          <React.Fragment key={post.slug}>
            <Seperator />
            <NextViewTransition
              href={post.slug}
              className="flex w-full justify-between py-2 dark:text-grey-100"
            >
              <p>{post.title}</p>
              <p className="mt-0 dark:text-grey-100">
                {formatter.date(new Date(post.date))}
              </p>
            </NextViewTransition>
          </React.Fragment>
        );
      })}
    </div>
  );
};
