import * as React from 'react';

interface Props {
  code: string;
}

export const UserVerificationTemplate: React.FC<Props> = ({
  code,
}) => (
  <div>

    <p><a href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?code=${code}`}>Folow the link to verify your account </a></p>

  </div>
);
