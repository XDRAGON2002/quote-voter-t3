import React from "react"
import { useSession } from "next-auth/react"

import { trpc } from "../utils/trpc"


interface QuoteType {
    id: string
    quote: string
    count: number
    ownerId: string
    ownerName: string
}

interface Iprops {
    item: QuoteType
    setQuotes: React.Dispatch<React.SetStateAction<QuoteType[]>>
    voters: string[]
    setVoters: React.Dispatch<React.SetStateAction<string[]>>
}
const Quote: React.FC<Iprops> = (props) => {
    const sessionData = useSession().data

    const deleteData = trpc.quote.deleteQuote.useMutation({
        onSuccess: (items) => {
            props.setQuotes(items)
        }
    })

    const switchVote = trpc.quote.switchVote.useMutation({
        onSuccess: (items) => {
            props.setQuotes(items.quotes)
            const newVoters = items.voters.map((voter) => voter.quoteId)
            props.setVoters(newVoters)
        }
    })

    return (
        <div className="border-2 border-black rounded-lg shadow-md w-full mb-5 break-inside-avoid">
            <div className="bg-red-100 py-3">
                <h1 className="mx-5 text-3xl break-words">{props.item.quote}</h1>
                <h1 className="mx-5 text-xl flex justify-end">~{props.item.ownerName}</h1>
            </div>
            <div className="flex space-x-5 justify-center border-t-black border-t-2 bg-blue-100">
                <h1 className="text-3xl">{props.item.count}</h1>
                <button onClick={() => switchVote.mutate({quoteId: props.item.id, userId: sessionData!.user!.id})}>{props.voters.includes(props.item.id) ? <img src="https://img.icons8.com/tiny-color/32/null/hearts.png"/> : <img src="https://img.icons8.com/small/32/null/hearts.png"/>}</button>
                {sessionData?.user?.id === props.item.ownerId && <button onClick={() => deleteData.mutate(props.item.id)}><img src="https://img.icons8.com/small/32/null/filled-trash.png"/></button>}
            </div>
        </div>
    )
}

export default Quote