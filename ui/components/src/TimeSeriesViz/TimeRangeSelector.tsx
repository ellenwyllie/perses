import React from 'react';
import { Popover, Button, Tabs, Input, DatePicker, Dropdown, Space, Menu } from 'antd';
import moment from 'relative-time-parser';
import { useTimeRange } from '@/framework/core';
export function TimerViewerDebugger() {
  const { rawRange, startTime, endTime, refresh, refreshInterval, setRefreshInterval, setTimeRange } = useTimeRange();
  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <div>Refresh Interval: {refreshInterval}</div>
      <div>
        Raw: <input value={`${rawRange.startTime} - ${rawRange.endTime}`} />
      </div>

      <div>
        Refresh:
        <button onClick={() => setRefreshInterval('5s')}>On</button>
        <button onClick={() => setRefreshInterval('off')}>Off</button>
      </div>

      <div>
        Time:
        <button onClick={() => setTimeRange({ startTime: '-30m', endTime: 'now' })}>30m</button>
        <button onClick={() => setTimeRange({ startTime: '-1h', endTime: 'now' })}>1h</button>
        <button onClick={() => setTimeRange({ startTime: '-2h', endTime: 'now' })}>2h</button>
        <button onClick={() => setTimeRange({ startTime: '-1d', endTime: 'now' })}>1d</button>
      </div>

      <div>
        Time: {moment(startTime).format()} - {moment(endTime).format()}{' '}
      </div>
    </div>
  );
}

function formatDateTime(d: any) {
  if (typeof d === 'string' && moment().isRelativeTimeFormat(d)) {
    return d;
  }
  return moment(d).format();
}

export function TimeRangeSelector({
  ranges = [
    {
      label: 'Last Hour',
      range: {
        startTime: '-1h',
        endTime: 'now',
      },
    },
    {
      label: 'Last 3 Hours',
      range: {
        startTime: '-3h',
        endTime: 'now',
      },
    },
    {
      label: 'Last 24 hours',
      range: {
        startTime: '-24h',
        endTime: 'now',
      },
    },
    {
      label: 'Last 2 Days',
      range: {
        startTime: '-2d',
        endTime: 'now',
      },
    },
    {
      label: 'Last 7 Days',
      range: {
        startTime: '-7d',
        endTime: 'now',
      },
    },
  ],
}) {
  const { rawRange, startTime, endTime, refresh, refreshInterval, setRefreshInterval, setTimeRange } = useTimeRange();
  return (
    <div className="flex items-center space-x-2">
      <Popover
        placement="bottomRight"
        content={
          <div className="flex divide-x">
            <div className="mr-4">
              {ranges.map((r) => {
                return (
                  <div key={r.range.startTime}>
                    <a onClick={() => setTimeRange(r.range)}>{r.label}</a>
                  </div>
                );
              })}
            </div>
            <div className="pl-4">
              <DatePicker.RangePicker
                showTime
                value={[moment(startTime), moment(endTime)]}
                onChange={(r) => {
                  if (!r) {
                    return;
                  }
                  setTimeRange({
                    startTime: r[0]?.valueOf(),
                    endTime: r[1]?.valueOf(),
                  });
                }}
              />
            </div>
          </div>
        }
      >
        <Button>
          {formatDateTime(rawRange.startTime)} - {formatDateTime(rawRange.endTime)}
        </Button>
      </Popover>
      <div className="flex items-center">
        <Dropdown
          overlay={
            <Menu
              items={['off', '5s', '10s', '1m'].map((v) => ({
                label: v,
                key: v,
                onClick: () => setRefreshInterval(v),
              }))}
            />
          }
        >
          <Button>{refreshInterval}</Button>
        </Dropdown>
      </div>
      <Button type="primary" onClick={refresh}>
        Refresh
      </Button>
    </div>
  );
}
