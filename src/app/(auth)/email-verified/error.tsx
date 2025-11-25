"use client"

export default function ErrorBoundary({error}: {error: Error}){
    return <div>Erreur dans Email verification - {error.message}</div>
}
