import { StringSubstringCriterionType } from 'bizzle/search/criterion';

interface Criteria {
  type: string;
  string: string;
}

export default function StringSubstring(str: string): Criteria {
  return {
    type: StringSubstringCriterionType,
    string: str
  };
}
