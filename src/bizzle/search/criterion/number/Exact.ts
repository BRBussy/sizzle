import { NumberExactCriterionType } from 'bizzle/search/criterion';

interface Crit {
  type: string;
  number: number;
}

export default function NumberExact(num: number): Crit {
  return {
    type: NumberExactCriterionType,
    number: num
  };
}
