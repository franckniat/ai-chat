import * as React from 'react'
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Font,
} from "@react-email/components";
import { Divider } from '@/components/ui/divider';

interface ResetPasswordConfirmationProps {
    name?: string | null
    email?: string
    resetUrl?: string
}

export const ResetPasswordConfirmation: React.FC<Readonly<ResetPasswordConfirmationProps>> = ({
    name = "John Doe",
    email = "john@example.com",
    resetUrl = "https://example.com/reset-password?token=abc123",
}) => {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Geist"
                    fallbackFontFamily="Helvetica"
                    webFont={{
                        url: 'https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Réinitialisation de votre mot de passe</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Heading style={logo}>niato ai.</Heading>
                    </Section>
                    <Section style={contentSection}>
                        <Heading style={h1}>Réinitialiser votre mot de passe</Heading>
                        <Text style={text}>
                            Bonjour {name || '👋'}, nous avons reçu une demande de
                            réinitialisation de mot de passe pour le compte associé à {email}.
                        </Text>
                        <Section style={btnSection}>
                            <Button style={button} href={resetUrl}>
                                Réinitialiser le mot de passe
                            </Button>
                        </Section>
                        <Text style={text}>
                            Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous
                            pouvez ignorer cet email en toute sécurité.
                        </Text>
                        <Divider />
                        <Text style={text}>
                            Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre
                            navigateur:
                        </Text>
                        <Link href={resetUrl} style={link}>
                            {resetUrl}
                        </Link>
                    </Section>
                    <Text style={footer}>
                        © {new Date().getFullYear()} Niato AI. Tous droits réservés.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

export default ResetPasswordConfirmation

const main = {
    backgroundColor: '#ffffff',
    fontFamily: 'Geist, Helvetica, Arial, sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
};

const logoSection = {
    padding: '20px 0',
    textAlign: 'center' as const,
};

const logo = {
    fontSize: '24px',
    margin: '0',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#0f172a',
};

const contentSection = {
    padding: '0 24px',
};

const h1 = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',   
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 16px',
    color: '#0f172a',
};

const text = {
    textAlign: 'center' as const,
    margin: '0 0 16px',
    color: '#475569',
    fontSize: '16px',
    lineHeight: '24px',
};

const btnSection = {
    textAlign: 'center' as const,
    margin: '24px 0',
};

const button = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const link = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#0f172a',
    textDecoration: 'underline',
    wordBreak: 'break-all' as const,
};

const footer = {
    color: '#94a3b8',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '24px',
};
