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

const podiumCollection = defineCollection({
    type: "content",
    schema: ({ image }) => z.object({
        rank: z.number(),
        team: z.string(),
        photo: image(),
        members: z.array(z.object({
            name: z.string(),
            instagram: z.string(),
        })),
    }),
});

const sponsorsCollection = defineCollection({
    type: "content",
    schema: z.object({
        order: z.number().int().min(1),
        name: z.string(),
        description: z.string(),
        logo: z.string(),
    }),
});

export const collections = {
    speakers: speakersCollection,
    podium: podiumCollection,
    sponsors: sponsorsCollection,
};