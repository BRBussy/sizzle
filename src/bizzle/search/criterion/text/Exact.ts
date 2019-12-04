import { TextExactCriterionType } from 'bizzle/search/criterion';

interface TextExactCriterionType {
  type: string;
  text: string;
}

export default TextExactCriterionType;

function TextExact(str: string): TextExactCriterionType {
  return {
    type: TextExactCriterionType,
    text: str
  };
}

export {TextExact};
