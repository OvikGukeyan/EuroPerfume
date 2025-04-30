import React from 'react';
import Autocomplete from 'react-google-autocomplete';

interface Props {
  onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return <Autocomplete
    style={{
      padding: '8px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      outline: 'none',

    }}
    options={{
      types: ['address'],
      componentRestrictions: { country: 'de' }
    }}
    placeholder="Address"
    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    onPlaceSelected={(place) => {
      const address = place?.formatted_address || '';
      onChange?.(address);
    }}
  />;
};
