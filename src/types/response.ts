export type BaseResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  pagination?: Pagination;
  error?: string;
};

export type Pagination = {
  totalData: number;
  currentPage: number;
  totalPage: number;
  nextPage: number | null;
  prevPage: number | null;
};
