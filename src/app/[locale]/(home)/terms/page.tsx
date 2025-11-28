import { Separator } from '@/components/ui/separator'
import { Shield, Lock, Eye, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function TermsPage() {
    const t = useTranslations('Terms');

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-muted-foreground text-lg">
                        {t('lastUpdated', { date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) })}
                    </p>
                </div>

                {/* Trust Banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-12">
                    <div className="flex items-start gap-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">{t('trust.title')}</h2>
                            <p className="text-muted-foreground">
                                {t('trust.desc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-card border rounded-xl p-6 mb-8">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        {t('toc')}
                    </h3>
                    <nav className="space-y-2">
                        <a href="#terms" className="block text-primary hover:underline">{t('sections.terms')}</a>
                        <a href="#privacy" className="block text-primary hover:underline">{t('sections.privacy')}</a>
                        <a href="#data-collection" className="block text-primary hover:underline pl-4">{t('sections.dataCollection')}</a>
                        <a href="#data-usage" className="block text-primary hover:underline pl-4">{t('sections.dataUsage')}</a>
                        <a href="#data-security" className="block text-primary hover:underline pl-4">{t('sections.dataSecurity')}</a>
                        <a href="#user-rights" className="block text-primary hover:underline pl-4">{t('sections.userRights')}</a>
                    </nav>
                </div>

                {/* Terms of Service */}
                <section id="terms" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="size-6 text-primary" />
                        <h2 className="text-3xl font-bold">{t('sections.terms')}</h2>
                    </div>

                    <div className="space-y-6 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.acceptance.title')}</h3>
                            <p>
                                {t('terms.acceptance.content')}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.usage.title')}</h3>
                            <p className="mb-3">{t('terms.usage.intro')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>{t('terms.usage.list.legal')}</li>
                                <li>{t('terms.usage.list.security')}</li>
                                <li>{t('terms.usage.list.illegal')}</li>
                                <li>{t('terms.usage.list.ip')}</li>
                                <li>{t('terms.usage.list.confidentiality')}</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.ip.title')}</h3>
                            <p>
                                {t('terms.ip.content')}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.liability.title')}</h3>
                            <p>
                                {t('terms.liability.content')}
                            </p>
                        </div>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Privacy Policy */}
                <section id="privacy" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="size-6 text-primary" />
                        <h2 className="text-3xl font-bold">{t('sections.privacy')}</h2>
                    </div>

                    {/* Data Collection */}
                    <div id="data-collection" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">{t('privacy.collection.title')}</h3>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>{t('privacy.collection.intro')}</p>
                            
                            <div className="bg-card border rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-green-500" />
                                    {t('privacy.collection.account.title')}
                                </h4>
                                <ul className="list-disc list-inside space-y-1 ml-6">
                                    <li>{t('privacy.collection.account.list.name')}</li>
                                    <li>{t('privacy.collection.account.list.email')}</li>
                                    <li>{t('privacy.collection.account.list.photo')}</li>
                                </ul>
                            </div>

                            <div className="bg-card border rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-green-500" />
                                    {t('privacy.collection.usage.title')}
                                </h4>
                                <ul className="list-disc list-inside space-y-1 ml-6">
                                    <li>{t('privacy.collection.usage.list.history')}</li>
                                    <li>{t('privacy.collection.usage.list.prefs')}</li>
                                    <li>{t('privacy.collection.usage.list.nav')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Data Usage */}
                    <div id="data-usage" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">{t('privacy.usage.title')}</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>{t('privacy.usage.intro')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>{t('privacy.usage.list.service')}</li>
                                <li>{t('privacy.usage.list.personalization')}</li>
                                <li>{t('privacy.usage.list.communication')}</li>
                                <li>{t('privacy.usage.list.security')}</li>
                                <li>{t('privacy.usage.list.analysis')}</li>
                            </ul>
                            
                            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                    <strong>{t('privacy.usage.important')}</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Security */}
                    <div id="data-security" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">{t('privacy.security.title')}</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>{t('privacy.security.intro')}</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">{t('privacy.security.encryption.title')}</h4>
                                    <p className="text-sm">{t('privacy.security.encryption.desc')}</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">{t('privacy.security.protection.title')}</h4>
                                    <p className="text-sm">{t('privacy.security.protection.desc')}</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">{t('privacy.security.access.title')}</h4>
                                    <p className="text-sm">{t('privacy.security.access.desc')}</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">{t('privacy.security.monitoring.title')}</h4>
                                    <p className="text-sm">{t('privacy.security.monitoring.desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Rights */}
                    <div id="user-rights" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">{t('privacy.rights.title')}</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>{t('privacy.rights.intro')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>{t('privacy.rights.list.access')}</li>
                                <li>{t('privacy.rights.list.rectification')}</li>
                                <li>{t('privacy.rights.list.erasure')}</li>
                                <li>{t('privacy.rights.list.portability')}</li>
                                <li>{t('privacy.rights.list.objection')}</li>
                                <li>{t('privacy.rights.list.restriction')}</li>
                            </ul>
                            
                            <div className="bg-card border rounded-lg p-4 mt-4">
                                <p className="font-medium text-foreground">
                                    {t.rich('privacy.rights.contact', {
                                        link: (chunks) => <Link href="/support" className="text-primary hover:underline">{chunks}</Link>
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Contact */}
                <section className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
                    <p className="text-muted-foreground mb-6">
                        {t('contact.desc')}
                    </p>
                    <Link 
                        href="/support" 
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {t('contact.button')}
                    </Link>
                </section>
            </div>
        </div>
    )
}
