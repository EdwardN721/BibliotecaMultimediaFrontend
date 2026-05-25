export interface PaginacionMetadata{
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface RespuestaPaginada<T>{
    metadata: PaginacionMetadata;
    registros: T[];
}