import * as React from 'react';

interface EmailTemplateProps {
  temporaryPassword: string
  name: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  temporaryPassword,
  name,
}) => (
  <div>
    <h1>Welcome to Promptify!</h1>
    <p>Hello {name},</p>
    <p>Here is your temporary password: <strong>{temporaryPassword}</strong></p>
    <p>Please change your password after logging in for the first time.</p>
    <p>Best regards, <br />The Promptify Team</p>
  </div>
);