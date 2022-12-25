import { type NextPage } from "next"
import Head from "next/head"
import { signIn, useSession } from "next-auth/react"

import QuotesList from "../components/QuotesList"

const Home: NextPage = () => {
  const sessionData = useSession().data

  return (
    <>
      <Head>
        <title>Quote Voter</title>
        <meta name="description" content="Application to vote quotes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionData && <QuotesList />}
      {!sessionData && <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-6xl mb-10">Quote Voter</h1>
        <h1 className="text-4xl mb-10">Sign In to post and vote quotes</h1>
        <button className="border-black border-2 bg-yellow-100 p-2 text-4xl rounded-lg" onClick={() => signIn()}>
          Sign In
        </button>
      </div>}
    </>
  )
}

export default Home
