import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Une page = un fichier Markdown dans src/content/pages/
const pages = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    // Encadré « en bref » affiché en haut de page
    facts: z.array(z.object({ label: z.string(), value: z.string(), icon: z.string().optional() })).optional(),
    // Vidéo : soit un identifiant YouTube, soit un fichier dans /public/videos (< 25 Mo)
    video: z
      .object({
        youtube: z.string().optional(),
        src: z.string().optional(),
        poster: z.string().optional(),
        caption: z.string(),
      })
      .optional(),
    // Illustration affichée en haut de page
    image: z.object({ src: z.string(), alt: z.string(), width: z.number(), height: z.number() }).optional(),
    // Bouton d'appel à l'action en bas de page
    cta: z.object({ label: z.string(), href: z.string() }).optional(),
  }),
});

// Questions fréquentes : src/content/faq.yaml
const faq = defineCollection({
  loader: file('./src/content/faq.yaml'),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    audience: z.enum(['tous', 'patients', 'controles']).default('tous'),
  }),
});

// Équipe : src/content/team.yaml
const team = defineCollection({
  loader: file('./src/content/team.yaml'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    motivation: z.string().optional(),
  }),
});

export const collections = { pages, faq, team };
