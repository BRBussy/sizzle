import { TextExactCriterionType } from 'bizzle/search/criterion';

interface TextExactCriterionType {
  type: string;
  string: string;
}

export default TextExactCriterionType;

function TextExact(str: string): TextExactCriterionType {
  return {
    type: TextExactCriterionType,
    string: str
  };
}

export {TextExact};