import { create } from 'zustand';

export const useEntriesStore = create((set) => ({
  entries: [],
  filterAndSortEntries: (
    totalEntryPayload,
    sortCondition,
    distance,
    sport,
    titleQuery,
    fromDateQuery,
    toDateQuery
  ) =>
    set((state) => ({
      entries: totalEntryPayload
        .filter((entry) => Number(distance) <= Number(entry.distance))
        .filter((remainingEntry) => sport === remainingEntry.type)
        .filter(
          (remainingEntry) => remainingEntry.name.indexOf(titleQuery) > -1
        )
        .filter((remainingEntry) => {
          if (fromDateQuery === '' && toDateQuery === '') {
            return remainingEntry;
          }

          const candidateDate = new Date(
            remainingEntry.start_date.slice(0, 10)
          );
          // If Only From Date is specified
          if (toDateQuery === '') {
            const filterFrom = new Date(fromDateQuery);
            return filterFrom <= candidateDate;
          }

          // If Only 'to Date' is specified
          if (fromDateQuery === '') {
            const filterTo = new Date(toDateQuery);
            return filterTo >= candidateDate;
          }

          // If both From and To Dates are specified
          const filterFrom = new Date(fromDateQuery);
          const filterTo = new Date(toDateQuery);
          return filterFrom <= candidateDate && filterTo >= candidateDate;
        })
        .slice()
        .sort(
          sortCondition === 'speedDesc'
            ? (a, b) => b.distance / b.moving_time - a.distance / a.moving_time
            : sortCondition === 'startDate'
            ? (a, b) => {
                return b.start_date - a.start_date;
              }
            : sortCondition === 'timeElapsedDesc'
            ? (a, b) => {
                return b.elapsed_time - a.elapsed_time;
              }
            : sortCondition === 'timeElapsedAsc'
            ? (a, b) => a.elapsed_time - b.elapsed_time
            : sortCondition === 'movingTimeDesc'
            ? (a, b) => b.moving_time - a.moving_time
            : sortCondition === 'movingTimeAsc'
            ? (a, b) => a.moving_time - b.moving_time
            : sortCondition === 'dateDesc'
            ? (a, b) =>
                (new Date(b.start_date) > new Date(a.start_date) && 1) || -1
            : sortCondition === 'dateAsc'
            ? (a, b) =>
                (new Date(a.start_date) > new Date(b.start_date) && 1) || -1
            : null
        ),
    })),
}));
