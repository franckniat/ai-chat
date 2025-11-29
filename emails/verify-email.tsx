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

interface VerifyEmailProps {
    name?: string | null
    email?: string
    verifyUrl?: string
}

export const VerifyEmail: React.FC<Readonly<VerifyEmailProps>> = ({ 
    name = "John Doe", 
    email = "john@example.com", 
    verifyUrl = "https://example.com/verify?token=abc123" 
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
            <Preview>Vérifiez votre email</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Heading style={logo}>niato ai.</Heading>
                    </Section>
                    <Section style={contentSection}>
                        <Heading style={h1}>Vérifiez votre email</Heading>
                        <Text style={text}>
                            Bonjour {name || '👋'}, confirmez votre adresse email pour activer
                            votre compte Niato AI.
                        </Text>
                        <Text style={text}>Adresse: {email}</Text>
                        <Section style={btnSection}>
                            <Button style={button} href={verifyUrl}>
                                Vérifier mon email
                            </Button>
                        </Section>
                        <Text style={text}>
                            Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre
                            navigateur:
                        </Text>
                        <Link href={verifyUrl} style={link}>
                            {verifyUrl}
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

export default VerifyEmail

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
