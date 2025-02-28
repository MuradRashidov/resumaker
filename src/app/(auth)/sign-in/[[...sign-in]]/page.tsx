import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <main className="h-screen p3 flex justify-center items-center">
            <SignIn />
        </main>
    )
}