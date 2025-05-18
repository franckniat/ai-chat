import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import React from 'react'

export default async function ChatPage() {
  const session = await auth.api.getSession({
    headers: await headers()
})


  return (
    <div className="">
      {JSON.stringify(session, null, 4)}
      <div className="h-screen w-[calc(100%-var(--sidebar-width))]">  </div>
    </div>
  )
}
