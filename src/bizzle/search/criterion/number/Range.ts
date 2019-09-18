import { NumberRangeCriterionType } from 'bizzle/search/criterion';

interface RangeValue {
  number: number;
  inclusive?: boolean;
  ignore?: boolean;
}

interface Criteria {
  type: string;
  start: RangeValue;
  end: RangeValue;
}

export default function NumberRangeCriterion(start: RangeValue, end: RangeValue): Criteria {
  return {
    type: NumberRangeCriterionType,
    start,
    end
  };
}