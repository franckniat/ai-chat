import * as React from 'react'
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Font,
    Hr,
} from "@react-email/components";

interface SupportNotificationProps {
    name: string
    email: string
    subject: string
    message: string
    type: "request" | "report"
}

export const SupportNotification: React.FC<Readonly<SupportNotificationProps>> = ({
    name,
    email,
    subject,
    message,
    type,
}) => {
    const typeLabel = type === "request" ? "Demande" : "Signalement";
    
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
            <Preview>Nouveau {typeLabel.toLowerCase()} de support - {subject}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Heading style={logo}>niato ai.</Heading>
                    </Section>
                    <Section style={contentSection}>
                        <Heading style={h1}>Nouveau {typeLabel} de Support</Heading>
                        
                        <Text style={label}>Type:</Text>
                        <Text style={value}>{typeLabel}</Text>
                        
                        <Text style={label}>De:</Text>
                        <Text style={value}>{name} ({email})</Text>
                        
                        <Text style={label}>Sujet:</Text>
                        <Text style={value}>{subject}</Text>
                        
                        <Hr style={hr} />
                        
                        <Text style={label}>Message:</Text>
                        <Text style={messageText}>{message}</Text>
                    </Section>
                    <Text style={footer}>
                        © {new Date().getFullYear()} Niato AI. Tous droits réservés.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

export default SupportNotification

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
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 24px',
    color: '#0f172a',
};

const label = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    margin: '16px 0 4px',
};

const value = {
    fontSize: '16px',
    color: '#0f172a',
    margin: '0 0 8px',
};

const hr = {
    borderColor: '#e2e8f0',
    margin: '24px 0',
};

const messageText = {
    fontSize: '16px',
    color: '#475569',
    lineHeight: '24px',
    whiteSpace: 'pre-wrap' as const,
    margin: '0',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
};

const footer = {
    color: '#94a3b8',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '24px',
};
