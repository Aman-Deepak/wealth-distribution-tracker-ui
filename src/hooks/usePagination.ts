// src/hooks/usePagination.ts
import { useState } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const [page, setPage] = useState(options.initialPage || 0);
  const [limit, setLimit] = useState(options.initialLimit || 25);

  const skip = page * limit;

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(0, prev - 1));
  const goToPage = (pageNumber: number) => setPage(Math.max(0, pageNumber));
  const resetPagination = () => setPage(0);

  return {
    page,
    limit,
    skip,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
  };
}