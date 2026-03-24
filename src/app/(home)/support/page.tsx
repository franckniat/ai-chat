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
                    message: result?.data?.message || 'An error occurred',
                })
            }
        } catch {
            setSubmitStatus({
                type: 'error',
                message: 'An error occurred while sending your request',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Support Center</h1>
                    <p className="text-muted-foreground text-lg">
                        Need help? Send us your request or report an issue.
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
                                        <FormLabel>Request Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="request">Support Request</SelectItem>
                                                <SelectItem value="report">Issue Report</SelectItem>
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
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
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
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Briefly describe your request"
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
                                                placeholder="Describe your request in detail..."
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
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 size-4" />
                                        Send Request
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        We aim to respond to all requests within 24-48 hours.
                    </p>
                </div>
            </div>
        </div>
    )
}
