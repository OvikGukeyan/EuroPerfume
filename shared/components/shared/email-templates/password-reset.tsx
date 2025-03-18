import * as React from 'react';

interface Props {
  code: string;
}

export const PasswordResetTemplate: React.FC<Props> = ({
  code,
}) => (
  <div>

    <p><a href={`${process.env.NEXT_PUBLIC_BASE_URL}/reset/${code}`}>Folow the link to recover your password </a></p>

  </div>
);
