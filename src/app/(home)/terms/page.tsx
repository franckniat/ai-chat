import { Separator } from '@/components/ui/separator'
import { Shield, Lock, Eye, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Conditions d&apos;utilisation et Confidentialité</h1>
                    <p className="text-muted-foreground text-lg">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Trust Banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-12">
                    <div className="flex items-start gap-4">
                        <Shield className="size-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Vos données sont en sécurité</h2>
                            <p className="text-muted-foreground">
                                Nous nous engageons à protéger votre vie privée et à traiter vos données avec le plus grand soin. 
                                Vos informations personnelles sont chiffrées et stockées de manière sécurisée.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-card border rounded-xl p-6 mb-8">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FileText className="size-5" />
                        Table des matières
                    </h3>
                    <nav className="space-y-2">
                        <a href="#terms" className="block text-primary hover:underline">1. Conditions d&apos;utilisation</a>
                        <a href="#privacy" className="block text-primary hover:underline">2. Politique de confidentialité</a>
                        <a href="#data-collection" className="block text-primary hover:underline pl-4">2.1 Données collectées</a>
                        <a href="#data-usage" className="block text-primary hover:underline pl-4">2.2 Utilisation des données</a>
                        <a href="#data-security" className="block text-primary hover:underline pl-4">2.3 Sécurité des données</a>
                        <a href="#user-rights" className="block text-primary hover:underline pl-4">2.4 Vos droits</a>
                    </nav>
                </div>

                {/* Terms of Service */}
                <section id="terms" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="size-6 text-primary" />
                        <h2 className="text-3xl font-bold">1. Conditions d&apos;utilisation</h2>
                    </div>

                    <div className="space-y-6 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.1 Acceptation des conditions</h3>
                            <p>
                                En accédant et en utilisant Niato AI, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
                                Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.2 Utilisation du service</h3>
                            <p className="mb-3">Vous vous engagez à :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Utiliser le service de manière légale et éthique</li>
                                <li>Ne pas tenter de contourner les mesures de sécurité</li>
                                <li>Ne pas utiliser le service pour des activités illégales ou nuisibles</li>
                                <li>Respecter les droits de propriété intellectuelle</li>
                                <li>Maintenir la confidentialité de vos identifiants de connexion</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.3 Propriété intellectuelle</h3>
                            <p>
                                Tout le contenu, les fonctionnalités et les technologies de Niato AI sont la propriété exclusive 
                                de Niato AI et sont protégés par les lois sur la propriété intellectuelle.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">1.4 Limitation de responsabilité</h3>
                            <p>
                                Niato AI est fourni &quot;tel quel&quot; sans garantie d&apos;aucune sorte. Nous ne sommes pas responsables 
                                des dommages directs, indirects, accessoires ou consécutifs résultant de l&apos;utilisation du service.
                            </p>
                        </div>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Privacy Policy */}
                <section id="privacy" className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="size-6 text-primary" />
                        <h2 className="text-3xl font-bold">2. Politique de confidentialité</h2>
                    </div>

                    {/* Data Collection */}
                    <div id="data-collection" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.1 Données collectées</h3>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>Nous collectons les types de données suivants :</p>
                            
                            <div className="bg-card border rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-green-500" />
                                    Informations de compte
                                </h4>
                                <ul className="list-disc list-inside space-y-1 ml-6">
                                    <li>Nom et prénom</li>
                                    <li>Adresse email</li>
                                    <li>Photo de profil (optionnelle)</li>
                                </ul>
                            </div>

                            <div className="bg-card border rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-green-500" />
                                    Données d&apos;utilisation
                                </h4>
                                <ul className="list-disc list-inside space-y-1 ml-6">
                                    <li>Historique des conversations avec l&apos;IA</li>
                                    <li>Préférences et paramètres</li>
                                    <li>Données de navigation (cookies, adresse IP)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Data Usage */}
                    <div id="data-usage" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.2 Utilisation des données</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>Nous utilisons vos données pour :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Fournir et améliorer nos services</li>
                                <li>Personnaliser votre expérience utilisateur</li>
                                <li>Communiquer avec vous concernant votre compte</li>
                                <li>Assurer la sécurité et prévenir la fraude</li>
                                <li>Analyser l&apos;utilisation du service pour l&apos;améliorer</li>
                            </ul>
                            
                            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                    <strong>Important :</strong> Nous ne vendons jamais vos données personnelles à des tiers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Security */}
                    <div id="data-security" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.3 Sécurité des données</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>Nous mettons en œuvre des mesures de sécurité robustes :</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">🔒 Chiffrement</h4>
                                    <p className="text-sm">Toutes les données sont chiffrées en transit (HTTPS) et au repos</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">🛡️ Protection</h4>
                                    <p className="text-sm">Authentification sécurisée et protection contre les accès non autorisés</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">🔐 Contrôle d&apos;accès</h4>
                                    <p className="text-sm">Accès limité aux données par le personnel autorisé uniquement</p>
                                </div>
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2">📊 Surveillance</h4>
                                    <p className="text-sm">Surveillance continue pour détecter les activités suspectes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Rights */}
                    <div id="user-rights" className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="size-5 text-primary" />
                            <h3 className="text-2xl font-semibold">2.4 Vos droits (RGPD)</h3>
                        </div>
                        <div className="space-y-3 text-muted-foreground">
                            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Droit d&apos;accès :</strong> Obtenir une copie de vos données personnelles</li>
                                <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                                <li><strong>Droit à l&apos;effacement :</strong> Demander la suppression de vos données</li>
                                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                                <li><strong>Droit d&apos;opposition :</strong> Vous opposer au traitement de vos données</li>
                                <li><strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
                            </ul>
                            
                            <div className="bg-card border rounded-lg p-4 mt-4">
                                <p className="font-medium text-foreground">
                                    Pour exercer vos droits, contactez-nous via la <a href="/support" className="text-primary hover:underline">page de support</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Contact */}
                <section className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Questions ?</h2>
                    <p className="text-muted-foreground mb-6">
                        Si vous avez des questions concernant ces conditions ou notre politique de confidentialité, 
                        n&apos;hésitez pas à nous contacter.
                    </p>
                    <a 
                        href="/support" 
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Contactez-nous
                    </a>
                </section>
            </div>
        </div>
    )
}
