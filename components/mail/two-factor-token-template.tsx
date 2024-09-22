import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  token: string;
}

export const TwoFactorTokenTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName, token }) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>You 2FA code: {token}</p>
  </div>
);
