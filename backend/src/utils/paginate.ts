import { MapperArray } from './mapper';

export interface PaginatedResult<T> {
  result: T[];
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
  // Fetch result if repositoryQuery is a function, otherwise use provided array
  const [result, totalCount] = Array.isArray(repositoryQuery)
    ? repositoryQuery
    : await repositoryQuery();

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPreviousPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  // Use MapperArray if no custom mapper is provided, otherwise map result with provided mapper
  const mappedData = mapper
    ? await Promise.all(result.map(mapper))
    : (MapperArray(
        result[0]?.constructor as new () => T,
        result as object[],
      ) as unknown as R[]);

  return {
    result: mappedData,
    pageSize: pageSize > totalCount && pageNumber === 1 ? totalCount : pageSize,
    pageNumber,
    totalPages,
    totalCount,
    hasPreviousPage,
    hasNextPage,
  };
}
