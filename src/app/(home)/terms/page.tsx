import { Separator } from '@/components/ui/separator'
import { Shield, Lock, Eye, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Terms of Use and Privacy Policy</h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Trust Banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-12">
                    <div className="flex items-start gap-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Your data is secure</h2>
                            <p className="text-muted-foreground">
                                We are committed to protecting your privacy and handling your data with the utmost care.
                                Your personal information is encrypted and stored securely.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-card border rounded-xl p-6 mb-8">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        Table of contents
                    </h3>
                    <nav className="space-y-2">
                        <a href="#terms" className="block text-primary hover:underline">1. Terms of Use</a>
                        <a href="#privacy" className="block text-primary hover:underline">2. Privacy Policy</a>
                        <a href="#data-collection" className="block text-primary hover:underline pl-4">2.1 Data Collection</a>
                        <a href="#data-usage" className="block text-primary hover:underline pl-4">2.2 Data Usage</a>
                        <a href="#data-security" className="block text-primary hover:underline pl-4">2.3 Data Security</a>
                        <a href="#user-rights" className="block text-primary hover:underline pl-4">2.4 Your Rights</a>
                    </nav>
                </div>

                {/* Terms of Service */}
                <section id="terms" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="size-6 text-primary" />
                        <h2 className="text-3xl font-bold">1. Terms of Use</h2>
                    </div>

                    <div className="space-y-6 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.1 Acceptance of Terms</h3>
                            <p>
                                By accessing and using Niato AI, you agree to be bound by these terms of use.
                                If you do not agree with these terms, please do not use our service.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.2 Use of the Service</h3>
                            <p className="mb-3">You agree to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Use the service in a lawful and ethical manner</li>
                                <li>Not attempt to bypass security measures</li>
                                <li>Not use the service for illegal or harmful activities</li>
                                <li>Respect intellectual property rights</li>
                                <li>Keep your login credentials confidential</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.3 Intellectual Property</h3>
                            <p>
                                All content, features, and technologies of Niato AI are the exclusive property
                                of Niato AI and are protected by intellectual property laws.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.4 Limitation of Liability</h3>
                            <p>
                                Niato AI is provided &quot;as is&quot; without warranty of any kind. We are not liable
                                for any direct, indirect, incidental, or consequential damages resulting from use of the service.
                            </p>
                        </div>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Privacy Policy */}
                <section id="privacy" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="size-6 text-primary" />
                        <h2 className="text-3xl font-bold">2. Privacy Policy</h2>
                    </div>

                    {/* Data Collection */}
                    <div id="data-collection" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.1 Data Collection</h3>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>We collect the following types of data:</p>

                            <div className="bg-card border rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-green-500" />
                                    Account Information
                                </h4>
                                <ul className="list-disc list-inside space-y-1 ml-6">
                                    <li>First and last name</li>
                                    <li>Email address</li>
                                    <li>Profile picture (optional)</li>
                                </ul>
                            </div>

                            <div className="bg-card border rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-green-500" />
                                    Usage Data
                                </h4>
                                <ul className="list-disc list-inside space-y-1 ml-6">
                                    <li>AI conversation history</li>
                                    <li>Preferences and settings</li>
                                    <li>Browsing data (cookies, IP address)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Data Usage */}
                    <div id="data-usage" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.2 Data Usage</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>We use your data to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide and improve our services</li>
                                <li>Personalize your user experience</li>
                                <li>Communicate with you about your account</li>
                                <li>Ensure security and prevent fraud</li>
                                <li>Analyze service usage to improve it</li>
                            </ul>

                            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                    <strong>Important:</strong> We never sell your personal data to third parties.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Security */}
                    <div id="data-security" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.3 Data Security</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>We implement robust security measures:</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">🔒 Encryption</h4>
                                    <p className="text-sm">All data is encrypted in transit (HTTPS) and at rest</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">🛡️ Protection</h4>
                                    <p className="text-sm">Secure authentication and protection against unauthorized access</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">🔐 Access Control</h4>
                                    <p className="text-sm">Data access limited to authorized personnel only</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">📊 Monitoring</h4>
                                    <p className="text-sm">Continuous monitoring to detect suspicious activity</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Rights */}
                    <div id="user-rights" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.4 Your Rights (GDPR)</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>In accordance with the GDPR, you have the following rights:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Right of access:</strong> Obtain a copy of your personal data</li>
                                <li><strong>Right to rectification:</strong> Correct inaccurate data</li>
                                <li><strong>Right to erasure:</strong> Request deletion of your data</li>
                                <li><strong>Right to data portability:</strong> Receive your data in a structured format</li>
                                <li><strong>Right to object:</strong> Object to the processing of your data</li>
                                <li><strong>Right to restriction:</strong> Restrict the processing of your data</li>
                            </ul>

                            <div className="bg-card border rounded-lg p-4 mt-4">
                                <p className="font-medium text-foreground">
                                    To exercise your rights, contact us through the <a href="/support" className="text-primary hover:underline">support page</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Contact */}
                <section className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Questions?</h2>
                    <p className="text-muted-foreground mb-6">
                        If you have any questions about these terms or our privacy policy,
                        feel free to contact us.
                    </p>
                    <a
                        href="/support"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Contact Us
                    </a>
                </section>
            </div>
        </div>
    )
}
