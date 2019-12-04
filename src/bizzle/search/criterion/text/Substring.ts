import { TextSubstringCriterionType } from 'bizzle/search/criterion';

interface TextSubstringCriterionType {
  type: string;
  string: string;
}

export default TextSubstringCriterionType;

function TextSubstring(str: string): TextSubstringCriterionType {
  return {
    type: TextSubstringCriterionType,
    string: str
  };
}

export {TextSubstring};
