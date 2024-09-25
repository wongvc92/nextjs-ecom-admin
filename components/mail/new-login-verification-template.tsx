import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  confirmLink: string;
}

export const NewLoginVerificationTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName, confirmLink }) => (
  <div>
    <h1>Hi, {firstName}!</h1>
    <p>
      Click <a href={confirmLink}>here</a> to confirm your email
    </p>
  </div>
);
