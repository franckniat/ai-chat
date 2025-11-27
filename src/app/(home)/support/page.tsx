'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supportSchema, type SupportFormData } from '@/schemas/support'
import { submitSupportRequest } from './support.action'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SupportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null
        message: string
    }>({ type: null, message: '' })

    const form = useForm<SupportFormData>({
        resolver: zodResolver(supportSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
            type: 'request',
        },
    })

    const onSubmit = async (data: SupportFormData) => {
        setIsSubmitting(true)
        setSubmitStatus({ type: null, message: '' })

        try {
            const result = await submitSupportRequest(data)

            if (result?.data?.success) {
                setSubmitStatus({
                    type: 'success',
                    message: result.data.message,
                })
                form.reset()
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: result?.data?.message || 'Une erreur est survenue',
                })
            }
        } catch {
            setSubmitStatus({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'envoi',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Centre d&apos;assistance</h1>
                    <p className="text-muted-foreground text-lg">
                        Besoin d&apos;aide ? Envoyez-nous votre demande ou signalez un problème.
                    </p>
                </div>

                <div className="bg-card border rounded-xl p-8 shadow-sm">
                    {submitStatus.type && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                                submitStatus.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                            }`}
                        >
                            {submitStatus.type === 'success' ? (
                                <CheckCircle2 className="size-5 mt-0.5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
                            )}
                            <p>{submitStatus.message}</p>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type de demande</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez un type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="request">Demande d&apos;assistance</SelectItem>
                                                <SelectItem value="report">Signalement</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom complet</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jean Dupont" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="jean.dupont@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sujet</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Décrivez brièvement votre demande"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Décrivez votre demande en détail..."
                                                className="min-h-[150px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                                size="lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 size-4" />
                                        Envoyer la demande
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Nous nous efforçons de répondre à toutes les demandes dans les 24-48 heures.
                    </p>
                </div>
            </div>
        </div>
    )
}
