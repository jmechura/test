export interface Pagination<T> {
  content: T[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ServerPagination<T> {
  pagination: {
    number: number;
    numberOfPages: number;
    start: number;
  };
  search: {
    predicateObject: T;
  };
  sort: {};
}
