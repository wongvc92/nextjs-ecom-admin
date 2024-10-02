import * as React from "react";

interface EmailTemplateProps {
  signUpLink: string;
}

export const NewUserInviteTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ signUpLink }) => (
  <div>
    <h1>Welcome to the club!</h1>
    <p>
      Please click <a href={signUpLink}>here</a> to sign up.
    </p>
  </div>
);
