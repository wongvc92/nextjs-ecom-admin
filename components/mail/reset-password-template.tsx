import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  resetLink: string;
}

export const ResetPasswordTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName, resetLink }) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>
      Click <a href={resetLink}>here</a> to reset your passwrod
    </p>
  </div>
);
