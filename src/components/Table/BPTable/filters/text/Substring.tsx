import { TextField } from '@material-ui/core';
import TextSubstringCriterionType, { TextSubstring } from 'bizzle/search/criterion/text/Substring';
import React, { useState } from 'react';

interface SubstringProps {
  onChange: (criterion: TextSubstringCriterionType | null) => void;
}

const Substring = (props: SubstringProps) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (event.target.value === '') {
      props.onChange(null);
    } else {
      props.onChange(TextSubstring(event.target.value));
    }
  };

  return (
    <TextField
      variant={'outlined'}
      value={value}
      onChange={handleChange}
      placeholder={'Search'}
    />
  );
};

export default Substring;
