import * as React from 'react';

interface EmailTemplateProps {
  name: string
  resetUrl: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  resetUrl,
  name,
}) => (
  <div>
    <h1>Welcome to Promptify!</h1>
    <p>Hello {name},</p>
    <p>Please click the link below to reset your password:</p>
    <a href={resetUrl}>Reset Password</a>
    <p>Best regards, <br />The Promptify Team</p>
  </div>
);