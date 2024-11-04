import React from 'react';
import Autocomplete from 'react-google-autocomplete';

interface Props {
  onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return <Autocomplete options={{
    types: ['address'],
    componentRestrictions: { country: 'de' }
  }}
    placeholder="Enter your address" 
    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    onPlaceSelected={(data) => console.log(data)} 
    />;
};
