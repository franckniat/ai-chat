"use client"

export default function ErrorBoundary({error}: {error: Error}){
    return <div>Erreur in login - {error.message}</div>
}
