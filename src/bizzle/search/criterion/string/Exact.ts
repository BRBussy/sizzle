import { StringExactCriterionType } from 'bizzle/search/criterion';

interface Criteria {
  type: string;
  string: string;
}

export default function StringExact(str: string): Criteria {
  return {
    type: StringExactCriterionType,
    string: str
  };
}
