interface SortingType {
  field: string;
  sortOrder: 'asc' | 'desc';
}

function NewSorting(field: string, sortOrder: 'asc' | 'desc'): SortingType {
  return {
    field,
    sortOrder
  };
}

export default class Query {
  public limit: number = 0;
  public offset: number = 0;
  public sorting: SortingType[] = [];

  constructor(query?: Query) {
    if (!query) {
      return;
    }
    this.limit = query.limit;
    this.offset = query.offset;
    this.sorting = query.sorting.map((s) => NewSorting(s.field, s.sortOrder));
  }
}

export {
  NewSorting
};
