import { z } from "zod"
import { router, protectedProcedure } from "../trpc"

export const quoteRouter = router({
    getAllQuotes: protectedProcedure // http://localhost:3000/api/trpc/quote.getAllQuotes
        .query(async ({ ctx }) => {
            return await ctx.prisma.quotes.findMany({
                orderBy: {
                    count: "desc"
                }
            })
        }),

    getQuote: protectedProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            return await ctx.prisma.quotes.findUnique({
                where: {
                    id: input
                }
            })
        }),
    
    getVoters: protectedProcedure
        .input(z.string())
        .query(async ({ input, ctx}) => {
            return await ctx.prisma.votes.findMany({
                where: {
                    userId: input
                }
            })
        }),

    addQuote: protectedProcedure
        .input(z.object({ quote: z.string(), ownerId: z.string(), ownerName: z.string() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.quotes.create({
                data: input
            })
            return await ctx.prisma.quotes.findMany({
                orderBy: {
                    count: "desc"
                }
            })
        }),

    switchVote: protectedProcedure
        .input(z.object({ quoteId: z.string(), userId: z.string()}))
        .mutation(async ({ input, ctx }) => {
            const quote = await ctx.prisma.votes.findMany({
                where: {
                    quoteId: input.quoteId,
                    userId: input.userId
                }
            })
            let val;
            quote.length ? val = -1 : val = 1
            await ctx.prisma.quotes.update({
                where: {
                    id: input.quoteId
                },
                data: {
                    count: {
                        increment: val
                    }
                }
            })
            if (quote.length) {
                await ctx.prisma.votes.deleteMany({
                    where: {
                        quoteId: input.quoteId,
                        userId: input.userId
                    }
                })
            }else {
                await ctx.prisma.votes.create({
                    data: input
                })
            }
            const quotes = await ctx.prisma.quotes.findMany({
                orderBy: {
                    count: "desc"
                }
            })
            const voters = await ctx.prisma.votes.findMany({
                where: {
                    userId: input.userId
                }
            })
            return {quotes: quotes, voters: voters}
        }),

    deleteQuote: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.quotes.delete({
                where: {
                    id: input
                }
            })
            return await ctx.prisma.quotes.findMany({
                orderBy: {
                    count: "desc"
                }
            })
        })
})