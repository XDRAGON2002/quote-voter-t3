import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

const Navbar: React.FC<React.PropsWithChildren> = (props) => {
    const [open, setOpen] = useState<boolean>(false)
    const sessionData = useSession().data
    
    return (
        <>
            {sessionData && <nav className="px-20 pt-20 flex space-x-20 text-6xl items-center justify-center">
                <div className="hidden lg:block">
                    {sessionData && <img className="rounded-full" src={sessionData!.user!.image!} alt="NO USER" onClick={() => setOpen(!open)} />}
                </div>
                <h1 className="block">Welcome {sessionData!.user!.name} !</h1>
                {sessionData && <button className="border-black border-2 bg-yellow-100 p-2 text-4xl rounded-lg" onClick={sessionData ? () => signOut() : () => signIn()}>
                    {sessionData ? "Sign Out" : "Sign In"}
                </button>}
            </nav>}
            {props.children}
        </>
    )
}

export default Navbar