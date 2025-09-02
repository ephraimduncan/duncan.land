import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { z } from "zod";

// Computed fields helper functions
const computedFields = {
  slug: (doc: any, collectionName: string) => {
    // Extract just the filename without extension
    const filename = doc._meta.fileName.replace(/\.mdx$/, '');
    return `/${collectionName}/${filename}`;
  },
  slugAsParams: (doc: any) => {
    // Extract just the filename without extension
    return doc._meta.fileName.replace(/\.mdx$/, '');
  },
  readTimeMinutes: (doc: any) => {
    const wordsPerMinute = 200;
    const noOfWords = doc.content.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);
    return `${readTime} min read`;
  },
};

// Add compatibility _raw field for migration
const addCompatibilityFields = (doc: any) => ({
  _raw: {
    sourceFilePath: doc._meta.filePath,
    sourceFileName: doc._meta.fileName,
    sourceFileDir: doc._meta.directory,
    flattenedPath: doc._meta.path,
    contentType: "mdx",
  },
});

export const Page = defineCollection({
  name: "pages",
  directory: "./content/pages",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
  transform: async (doc, context) => {
    const body = await compileMDX(context, doc, {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    });

    return {
      ...doc,
      body,
      slug: computedFields.slug(doc, 'pages'),
      slugAsParams: computedFields.slugAsParams(doc),
      readTimeMinutes: computedFields.readTimeMinutes(doc),
      ...addCompatibilityFields(doc),
    };
  },
});

export const Post = defineCollection({
  name: "posts",
  directory: "./content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().transform((str) => new Date(str)),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    archived: z.boolean().default(false),
    reference: z.string().optional(),
  }),
  transform: async (doc, context) => {
    const body = await compileMDX(context, doc, {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    });

    return {
      ...doc,
      body,
      slug: computedFields.slug(doc, 'posts'),
      slugAsParams: computedFields.slugAsParams(doc),
      readTimeMinutes: computedFields.readTimeMinutes(doc),
      ...addCompatibilityFields(doc),
    };
  },
});

export const Thoughts = defineCollection({
  name: "thoughts",
  directory: "./content/thoughts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    date: z.string().transform((str) => new Date(str)),
  }),
  transform: async (doc, context) => {
    const body = await compileMDX(context, doc, {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    });

    return {
      ...doc,
      body,
      slug: computedFields.slug(doc, 'thoughts'),
      slugAsParams: computedFields.slugAsParams(doc),
      readTimeMinutes: computedFields.readTimeMinutes(doc),
      ...addCompatibilityFields(doc),
    };
  },
});

export default defineConfig({
  collections: [Post, Page, Thoughts],
});