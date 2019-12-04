import { TextSubstringCriterionType } from 'bizzle/search/criterion';

interface TextSubstringCriterionType {
  type: string;
  text: string;
}

export default TextSubstringCriterionType;

function TextSubstring(str: string): TextSubstringCriterionType {
  return {
    type: TextSubstringCriterionType,
    text: str
  };
}

export {TextSubstring};
