// Copyright 2021 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useState, useMemo, useCallback } from 'react';
import { TimeRangeValue, AbsoluteTimeRange, toAbsoluteTimeRange, isRelativeValue } from '@perses-dev/core';
import { TimeRange, TimeRangeContext } from '../runtime/time-range';

export interface TimeRangeProviderProps {
  // TODO: initialValue also needs to accept an AbsoluteTimeRange
  initialValue: TimeRangeValue;
  children?: React.ReactNode;
  onDateRangeChange?: (e: TimeRangeValue) => void;
}

/**
 * Provider implementation that supplies the TimeRangeState at runtime.
 */
export function TimeRangeStateProvider(props: TimeRangeProviderProps) {
  const { initialValue, children, onDateRangeChange } = props;

  const defaultTimeRange: AbsoluteTimeRange = isRelativeValue(initialValue)
    ? toAbsoluteTimeRange(initialValue)
    : initialValue;
  const [timeRange, setActiveTimeRange] = useState<AbsoluteTimeRange>(defaultTimeRange);

  const setTimeRange: TimeRange['setTimeRange'] = useCallback(
    (value: TimeRangeValue) => {
      if (isRelativeValue(value)) {
        const convertedAbsoluteTime = toAbsoluteTimeRange(value);
        setActiveTimeRange(convertedAbsoluteTime);
      } else {
        setActiveTimeRange(value);
      }
      if (onDateRangeChange !== undefined) {
        onDateRangeChange(value);
      }
    },
    [onDateRangeChange]
  );

  const ctx = useMemo(() => ({ timeRange, initialValue, setTimeRange }), [timeRange, initialValue, setTimeRange]);

  return <TimeRangeContext.Provider value={ctx}>{children}</TimeRangeContext.Provider>;
}
