import React, { useState } from "react"
import { useSession } from "next-auth/react"

import { trpc } from "../utils/trpc"

import Quote from "./Quote"

interface QuoteType {
    id: string
    quote: string
    count: number
    ownerId: string
    ownerName: string
}

const QuotesList: React.FC = () => {
    const [quotes, setQuotes] = useState<QuoteType[]>([])
    const [voters, setVoters] = useState<string[]>([])
    const [quote, setQuote] = useState<string>("")
    const sessionData = useSession().data

    const allData = trpc.quote.getAllQuotes.useQuery(undefined, {
        onSuccess: (items) => {
            setQuotes(items)
        }
    })

    const votersData = trpc.quote.getVoters.useQuery(sessionData!.user!.id, {
        onSuccess: (voters) => {
            const newVoters = voters.map((voter) => voter.quoteId)
            setVoters(newVoters)
        }
    })

    const addData = trpc.quote.addQuote.useMutation({
        onSuccess: (items) => {
            setQuotes(items)
            setQuote("")
        }
    }) 

    return (
        <div className="p-20 h-full">
            <h1 className="text-6xl flex justify-center">Quotes</h1>
            <div className="flex justify-center space-x-4 mt-8">
                <input className="w-4/5 p-2 border-black border-2 text-3xl rounded-lg" type="text" value={quote} onChange={(e) => setQuote(e.target.value)} />
                <button className="border-black border-2 bg-green-100 p-2 text-3xl rounded-lg" onClick={() => addData.mutate({ quote: quote, ownerId: sessionData!.user!.id!, ownerName: sessionData!.user!.name!})}><img src="https://img.icons8.com/small/64/null/add.png"/></button>
            </div>
            <ul className="mt-10 columns-2xs">
                {quotes.map((item, idx) => {
                    return <Quote key={idx} item={item} setQuotes={setQuotes} voters={voters} setVoters={setVoters}/>
                })}
            </ul>
        </div>
    )
}

export default QuotesList