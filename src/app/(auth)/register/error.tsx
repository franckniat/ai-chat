"use client"

export default function ErrorBoundary({error}: {error: Error}){
    return <div>Erreur in register - {error.message}</div>
}
