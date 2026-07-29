import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string().optional(),
  }),
});

// Russian blog twin. Same slugs as `blog` so hreflang pairs cleanly and
// verify.mjs can gate EN/RU parity the way it does for service pages.
const blogRu = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string().optional(),
  }),
});

export const collections = { blog, 'blog-ru': blogRu };
