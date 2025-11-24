"use client"

export default function ErrorBoundary({error}: {error: Error}){
    return <div>Error in forgot-password - {error.message}</div>
}
