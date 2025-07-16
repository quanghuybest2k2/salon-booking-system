import { MapperArray } from './mapper';

export interface PaginatedResult<T> {
  data: T[];
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export async function paginate<T, R>(
  repositoryQuery: (() => Promise<[T[], number]>) | [T[], number],
  pageSize: number = 10,
  pageNumber: number = 1,
  mapper?: (entity: T) => R | Promise<R>,
): Promise<PaginatedResult<R>> {
  // Fetch data if repositoryQuery is a function, otherwise use provided array
  const [data, totalCount] = Array.isArray(repositoryQuery)
    ? repositoryQuery
    : await repositoryQuery();

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPreviousPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  // Use MapperArray if no custom mapper is provided, otherwise map data with provided mapper
  const mappedData = mapper
    ? await Promise.all(data.map(mapper))
    : (MapperArray(
        data[0]?.constructor as new () => T,
        data as object[],
      ) as unknown as R[]);

  return {
    data: mappedData,
    pageSize: pageSize > totalCount && pageNumber === 1 ? totalCount : pageSize,
    pageNumber,
    totalPages,
    totalCount,
    hasPreviousPage,
    hasNextPage,
  };
}
