import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  email: string;
  customLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  email,
  customLink
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Click the link below to verify your email address: {email}</p>
    <a href={customLink}>Verify Email</a>
  </div>
);