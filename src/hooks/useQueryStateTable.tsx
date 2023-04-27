import { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import qs from "qs";

export const useQueryStateTable = ({
  pageSize,
  currentPage,
  filtersValue
}: {
  pageSize: number | undefined | null;
  currentPage: number | undefined | null;
  filtersValue: string | undefined | null;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialRef = useRef(true);

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
    } else {
      const existingQueries = qs.parse(location.search, {
        ignoreQueryPrefix: true
      });

      const queryString = qs.stringify(
        { ...existingQueries, pageSize, currentPage, filtersValue },
        { skipNulls: true }
      );

      navigate(`${location.pathname}?${queryString}`);
    }
  }, [pageSize, currentPage, filtersValue]);

  return {
    startPageSize: qs.parse(location.search, { ignoreQueryPrefix: true })[pageSize || 15],
    startCurrentPage: qs.parse(location.search, { ignoreQueryPrefix: true })[currentPage || 1],
    startFiltersValue: filtersValue
      ? qs.parse(location.search, { ignoreQueryPrefix: true })[filtersValue]
      : null
    // final: setQuery
  };
};
