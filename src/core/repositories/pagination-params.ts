export interface PaginationParams<T = unknown> {
  page: number
  limit: number
  filterBy?: T
}
