// Copyright 2023 The Perses Authors
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

import { useState } from 'react';
import { Alert, AlertTitle, Box, FormGroup, FormControlLabel, Switch, switchClasses } from '@mui/material';
// import { useDatasourceHeaders, useDatasourceStore } from '@perses-dev/plugin-system';
import { useDatasourceHeaders } from '@perses-dev/plugin-system';

// interface TruncateResultsBannerProps {
//   showBanner?: boolean;
// }

// const DEFAULT_QUERY_LIMITS_HEADERS = {
//   'm3-limit-max-returned-datapoints': '400000',
//   'm3-limit-max-returned-series': '4000',
// };

const DEFAULT_QUERY_LIMITS_HEADERS = {
  'm3-limit-max-returned-datapoints': '150',
  'm3-limit-max-returned-series': '1',
};

// TODO: TruncateResultsBanner will move to internal repo and show above DashboardsToolbar
// export function TruncateResultsBanner({ showBanner }: TruncateResultsBannerProps) {
export function TruncateResultsBanner() {
  const [limitsEnabled, setLimitsEnabled] = useState<boolean>(true);

  // const datasourceStore = useDatasourceStore();

  const { setDatasourceHeaders } = useDatasourceHeaders();

  return (
    <Box margin={2}>
      <Alert
        variant="filled"
        severity="info"
        action={
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={limitsEnabled}
                  color="default"
                  onChange={(e) => {
                    setLimitsEnabled(e.target.checked);
                    setDatasourceHeaders(e.target.checked ? DEFAULT_QUERY_LIMITS_HEADERS : {});
                  }}
                />
              }
              label="Truncate expensive query results"
            />
          </FormGroup>
        }
      >
        <AlertTitle sx={{ paddingTop: 0.25 }}>Queries were truncated on this dashboard.</AlertTitle>
      </Alert>
    </Box>
  );
}
