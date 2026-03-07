import { defineCollection, z } from "astro:content";

const speakersCollection = defineCollection({
    type: "content",
    schema: ({image}) => z.object({
        name: z.string(),
        role: z.string(),
        company: z.string(),
        avatar: image(),
        tittle: z.string(),
        github: z.string(),
        linkedin: z.string(),
        instagram: z.string(),
        bio: z.string(),
    }),
});

export const collections = {
    speakers: speakersCollection,
};