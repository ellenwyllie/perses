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

import { Box } from '@mui/material';

interface TabPanelProps {
  children: React.ReactNode;
  isActive: boolean;
  index: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, isActive, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`options-editor-tabpanel-${index}`}
      aria-labelledby={`options-editor-tab-${index}`}
      {...other}
    >
      {isActive && <Box mt={2}>{children}</Box>}
    </div>
  );
}
