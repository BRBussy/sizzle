import { TextListCriterionType } from 'bizzle/search/criterion';

interface TextListCriterionType {
  type: string;
  list: string[];
}

export default TextListCriterionType;

function TextList(list: string[]): TextListCriterionType {
  return {
    type: TextListCriterionType,
    list
  };
}

export {
  TextList
};
