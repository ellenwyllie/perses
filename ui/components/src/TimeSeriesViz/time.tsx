import moment from 'relative-time-parser';
import { useMemo, useEffect, useCallback, useState } from 'react';
import constate from 'constate';
import { TimeRange } from './types';
import { DurationString, DateTimeFormat } from './types';
// import { convertDateTimeFormatToUnixMS, convertDurationToMilliseconds } from './';

// 1m = 60000
// 5s = 1000 * 5
export function convertDurationToMilliseconds(duration: DurationString) {
  const start = moment()
    .relativeTime('-' + duration)
    .valueOf();
  const end = Date.now().valueOf();
  return end - start;
}

export function convertDateTimeFormatToUnixMS(val: DateTimeFormat) {
  if (typeof val === 'string' && moment().isRelativeTimeFormat(val)) {
    return moment().relativeTime(val).valueOf();
  }
  return moment(val).valueOf();
}

function useTimeRangeStore({ initialStartTime = '-1h', initialEndTime = 'now', initialRefreshInterval = 'off' }) {
  const [refreshId, setRefreshId] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(initialRefreshInterval);
  const refresh = useCallback(() => {
    setRefreshId(refreshId + 1);
  }, [refreshId]);

  const [rawRange, setRawRange] = useState<TimeRange>({
    startTime: initialStartTime,
    endTime: initialEndTime,
  });

  const { startTime, endTime } = useMemo(() => {
    return {
      startTime: convertDateTimeFormatToUnixMS(rawRange.startTime),
      endTime: convertDateTimeFormatToUnixMS(rawRange.endTime),
    };
  }, [refreshId, rawRange.startTime, rawRange.endTime]);

  const setTimeRange = (range: TimeRange) => {
    setRawRange(range);
    refresh();
  };

  // Handles refresh logic
  useEffect(() => {
    if (refreshInterval === 'off') {
      return;
    }
    const refreshIntervalMS = convertDurationToMilliseconds(refreshInterval);
    let currentId: number | null = null;
    currentId = setInterval(() => {
      refresh();
    }, refreshIntervalMS);
    return () => {
      if (currentId) {
        clearInterval(currentId);
      }
    };
  }, [refreshInterval, refresh]);

  return {
    startTime,
    endTime,
    rawRange,
    refresh,
    setTimeRange,
    refreshInterval,
    setRefreshInterval,
    refreshId,
  };
}

export const [TimeRangeProvider, useTimeRange] = constate(useTimeRangeStore);
