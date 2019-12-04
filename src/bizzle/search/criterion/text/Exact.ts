import { TextExactCriterionType } from 'bizzle/search/criterion';

interface Criteria {
  type: string;
  string: string;
}

export default function StringExact(str: string): Criteria {
  return {
    type: TextExactCriterionType,
    string: str
  };
}
