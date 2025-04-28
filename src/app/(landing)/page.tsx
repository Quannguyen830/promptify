"use client"

import Link from "next/link";
import { useState } from "react";
import PrimaryButton from "~/components/landing/button/primary-button";
import Navbar from "~/components/landing/navbar";
import { api } from "~/trpc/react";



export default function LandingPage() {
  const [inputMail, setInputMail] = useState<string>("");
  const [confirm, setConfirm] = useState<boolean>(false);

  const addWaitlist = api.waitlist.addNewWaiter.useMutation();

  function handleSubmit() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(inputMail)) {
      setConfirm(true);
      void addWaitlist.mutate({ email: inputMail });
    }
  }
  
  return (
    // <div className="flex flex-col h-full min-h-screen bg-gradient-to-t from-amber-100 to-white">
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-br from-sky-200 via-amber-50 to-rose-200 animate-gradient">
      <Navbar/>

      <div className="flex gap-4 justify-center items-center flex-col h-2/3 w-full">
        <h1 className="text-6xl font-bold leading-1/5">AI-assisted Online <span className="bg-instagram bg-clip-text text-transparent">Document Editor</span></h1>
        <h2 className="text-black/50 text-xl text-center w-1/2">
          Edit, organize and chat with your DocX, PDF files effortlessly all in one workspace
        </h2>

        <div className="mt-4">
          {!confirm ? (
            <div className="relative">
              <input 
                className=" outline-none h-10 w-[420px] rounded-2xl pl-4 ring-1"
                type="text"
                onChange={(e) => setInputMail(e.target.value)}
                placeholder="user@example.com"
              />
              <PrimaryButton onClick={handleSubmit} className="absolute right-1 top-1 w-40">Join our waitlist</PrimaryButton>
            </div>
          ) : (
            <p>Thank you for your interest!</p>
          )}
          
          <p className="pt-2 text-center underline">
            <Link href="https://mail.google.com/mail/?view=cm&fs=1&to=promptify.dev@gmail.com">promptify.dev@gmail.com</Link>
          </p>
        </div>
      </div>

    </div>
  )
}