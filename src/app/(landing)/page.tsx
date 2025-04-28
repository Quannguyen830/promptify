import PrimaryButton from "~/components/landing/button/primary-button";
import Navbar from "~/components/landing/navbar";


export function addToWaitList() {
  return
}

export default function LandingPage() {
  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-r from-amber-50 to-white">
      <Navbar/>

      <div className="flex gap-4 justify-center items-center flex-col h-2/3 w-full">
        <h1 className="text-6xl font-bold leading-1/5">AI-assisted Online <span className="bg-instagram bg-clip-text text-transparent">Document Editor</span></h1>
        <h2 className="text-black/50 text-xl text-center w-1/2">
          Edit, organize and chat with your DocX, PDF files effortlessly all in one workspace
        </h2>

        <PrimaryButton className="w-40">Join our waitlist</PrimaryButton>
      </div>
    </div>
  )
}