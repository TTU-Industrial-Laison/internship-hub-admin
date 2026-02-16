"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  setSearchTerm,
  setStatus,
  setPage,
  setDynamicParam,
  resetFilters,
  initializeFromUrl,
  selectFiltersByEntity,
} from "@/lib/store/slices/search-filter-slice";
import { EntityFilters, FilterState } from "@/types/store/search-filter";
import { FilterConfig } from "@/types/common/filter-config";

/**
 * Custom hook for managing search filters with URL synchronization
 *
 * This hook handles:
 * - Reading initial filter state from URL params
 * - Syncing filter changes to URL
 * - Managing filter state in Redux
 * - Providing callbacks for filter updates
 *
 * @param entity - The entity type (e.g., 'internshipPeriods')
 * @param config - Filter configuration including param names and dynamic params
 */
export function useSearchFilter(
  entity: keyof EntityFilters,
  config: FilterConfig
) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get filter state from Redux for this entity
  const filters = useAppSelector(selectFiltersByEntity(entity));

  // Local state for search input (allows typing without immediate Redux updates)
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  /**
   * Ref to track when resetFilters is called
   * This flag tells the URL update effect to explicitly remove dynamic params
   */
  const isResettingRef = useRef(false);

  /**
   * Ref to prevent URL sync during initialization
   * This prevents the URL from being updated while we're reading from it
   */
  const isInitializingRef = useRef(true);

  /**
   * INITIALIZATION EFFECT
   * Runs once on mount to reset filters and read values from URL params
   * This ensures every page visit starts fresh
   */
  useEffect(() => {
    isInitializingRef.current = true;

    const urlParams: Partial<FilterState> = {};

    // Read standard filter params from URL
    const name = searchParams.get(config.searchParam);
    const status = config.statusParam
      ? searchParams.get(config.statusParam)
      : null;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // Map URL params to filter state
    if (name) urlParams.searchTerm = name;
    if (status) urlParams.status = status;
    if (page) urlParams.page = parseInt(page) > 0 ? parseInt(page) : 1;

    if (limit) urlParams.size = parseInt(limit);

    /**
     * Read dynamic params from URL
     */
    if (config.dynamicParams) {
      Object.entries(config.dynamicParams).forEach(([filterKey, apiKey]) => {
        const value = searchParams.get(apiKey);
        if (value) urlParams[filterKey] = value;
      });
    }

    // Always reset to initial state first, then apply URL params
    dispatch(resetFilters({ entity, keepSize: false }));

    // Apply URL params if any exist
    if (Object.keys(urlParams).length > 0) {
      dispatch(initializeFromUrl({ entity, params: urlParams }));
    }

    // Mark initialization as complete
    isInitializingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - runs once on mount

  /**
   * SYNC EFFECT
   * Keep local search input in sync with Redux state
   * This ensures the input shows the correct value after Redux updates
   */
  useEffect(() => {
    setLocalSearchTerm(filters.searchTerm);
  }, [filters.searchTerm]);

  /**
   * API PARAMS MEMO
   * Converts Redux filter state into API query parameters
   * Only includes non-empty values to avoid sending unnecessary params
   */
  const apiParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      limit: filters.size,
    };

    // Add search term if not empty
    if (filters.searchTerm.trim())
      params[config.searchParam] = filters.searchTerm.trim();

    // Add status if valid (not empty or "ALL")
    if (
      filters.status &&
      filters.status !== "" &&
      filters.status !== "ALL" &&
      config.statusParam
    )
      params[config.statusParam] = filters.status;

    // Add dynamic params if they have valid values
    if (config.dynamicParams) {
      Object.entries(config.dynamicParams).forEach(([filterKey, apiKey]) => {
        const value = filters[filterKey];
        if (value && value !== "" && value !== "ALL")
          params[apiKey] = value.toString();
      });
    }

    return params;
  }, [filters, config]);

  /**
   * URL SYNC EFFECT
   * Updates browser URL whenever filter state changes
   */
  useEffect(() => {
    // Don't sync URL during initialization to prevent loops
    if (isInitializingRef.current) return;

    const params = new URLSearchParams();

    // Preserve existing query params that are NOT part of our filter state
    /**
     * Handle reset operation
     */
    if (isResettingRef.current) {
      isResettingRef.current = false;
    }

    // Add pagination params (always present or only if modified?)
    if (filters.page > 1) params.set("page", filters.page.toString());
    if (filters.size !== 15) params.set("limit", filters.size.toString());

    // Add active filter params
    if (filters.searchTerm.trim())
      params.set(config.searchParam, filters.searchTerm.trim());

    if (
      filters.status &&
      filters.status !== "" &&
      filters.status !== "ALL" &&
      config.statusParam
    )
      params.set(config.statusParam, filters.status);

    if (config.dynamicParams) {
      Object.entries(config.dynamicParams).forEach(([filterKey, apiKey]) => {
        const value = filters[filterKey];
        if (value && value !== "" && value !== "ALL")
          params.set(apiKey, value.toString());
      });
    }

    // Update URL if it changed
    const newQuery = params.toString();
    const currentQuery = searchParams.toString();


    if (newQuery !== currentQuery) {
      // Only replace if significantly different

      searchParams.forEach((value, key) => {
        // If it's not one of our managed keys, keep it.
        const isManaged =
          key === "page" ||
          key === "limit" ||
          key === config.searchParam ||
          key === config.statusParam ||
          (config.dynamicParams &&
            Object.values(config.dynamicParams).includes(key));

        if (!isManaged) {
          params.set(key, value);
        }
      });

      const finalQuery = params.toString();
      if (finalQuery !== currentQuery) {
        router.replace(`${pathname}?${finalQuery}`, { scroll: false });
      }
    }
  }, [filters, pathname, router, searchParams, config]);

  const triggerSearch = useCallback(() => {
    if (localSearchTerm !== filters.searchTerm) {
      dispatch(setSearchTerm({ entity, searchTerm: localSearchTerm }));
    }
  }, [localSearchTerm, filters.searchTerm, dispatch, entity]);

  const handleSetStatus = useCallback(
    (status: string) => dispatch(setStatus({ entity, status })),
    [dispatch, entity]
  );

  const handleSetPage = useCallback(
    (page: number) => dispatch(setPage({ entity, page })),
    [dispatch, entity]
  );

  const handleSetDynamicParam = useCallback(
    (key: string, value: string | number) =>
      dispatch(setDynamicParam({ entity, key, value })),
    [dispatch, entity]
  );

  const handleResetFilters = useCallback(() => {
    isResettingRef.current = true;
    dispatch(resetFilters({ entity, keepSize: true }));
    setLocalSearchTerm(""); // Reset local input too
  }, [dispatch, entity]);

  return {
    filters,
    localSearchTerm,
    setLocalSearchTerm,
    setStatus: handleSetStatus,
    setPage: handleSetPage,
    setDynamicParam: handleSetDynamicParam,
    resetFilters: handleResetFilters,
    triggerSearch,
    getApiParams: () => apiParams,
  };
}
