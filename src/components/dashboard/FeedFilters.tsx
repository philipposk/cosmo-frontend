"use client";

import { useAppStore } from "@/store/useAppStore";

const filters = [
  { value: "all", label: "All" },
  { value: "friends", label: "Friends" },
  { value: "categories", label: "Topics" },
  { value: "care", label: "Care" },
] as const;

export const FeedFilters = () => {
  const feedFilter = useAppStore((state) => state.feedFilter);
  const setFeedFilter = useAppStore((state) => state.setFeedFilter);

  return (
    <div className="lib-tabs" role="tablist" aria-label="Feed filter">
      {filters.map((filter) => {
        const active = feedFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => setFeedFilter(filter.value)}
            className={"lib-tab" + (active ? " active" : "")}
            type="button"
            role="tab"
            aria-selected={active}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
