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
import { Alert, AlertTitle, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { useDatasourceHeaders, useDatasourceStore } from '@perses-dev/plugin-system';

interface TruncateResultsBannerProps {
  showBanner?: boolean;
}

export function TruncateResultsBanner({ showBanner }: TruncateResultsBannerProps) {
  console.log('TruncateResultsBanner -> showBanner: ', showBanner);

  const [limitsEnabled, setLimitsEnabled] = useState<boolean>(false);

  const datasourceStore = useDatasourceStore();
  console.log('TruncateResultsBanner -> datasourceStore: ', datasourceStore);

  const { setDatasourceHeaders } = useDatasourceHeaders();

  return (
    <Alert
      variant="filled"
      severity="info"
      action={
        <FormGroup>
          {/* <FormControlLabel control={<Switch defaultChecked />} label="Truncate expensive query results" /> */}
          <FormControlLabel
            control={
              <Switch
                checked={limitsEnabled}
                onChange={(e) => {
                  setLimitsEnabled(e.target.checked);
                  console.log('TruncateResultsBanner -> setDatasourceHeaders: ', setDatasourceHeaders);
                  setDatasourceHeaders({});
                }}
              />
            }
            label="Truncate expensive query results"
          />
        </FormGroup>
      }
    >
      <AlertTitle>Queries were truncated on this dashboard.</AlertTitle>
    </Alert>
  );
}
