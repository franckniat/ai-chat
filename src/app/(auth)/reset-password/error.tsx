"use client"

export default function ErrorBoundary({error}: {error: Error}){
    return <div>Erreur in reset-password - {error.message}</div>
}
