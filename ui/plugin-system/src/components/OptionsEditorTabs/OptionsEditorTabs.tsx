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

import { Tab, Tabs, TabsProps, Box } from '@mui/material';
import { useState } from 'react';
import { TabPanel } from './TabPanel';

export type OptionsEditorTab = {
  label: string;
  /**
   * Content rendered when the tab is active.
   */
  content: React.ReactNode;
};

export type OptionsEditorTabsProps = {
  tabs: OptionsEditorTab[];
  mode?: 'Add' | 'Edit';
};

export const OptionsEditorTabs = ({ tabs, mode = 'Add' }: OptionsEditorTabsProps) => {
  // If user is adding a panel, default to first tab ("General")
  // If user is editing a panel, default to second tab ("Query" or "Markdown")
  const defaultTab = mode === 'Add' ? 0 : 1;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleChange: TabsProps['onChange'] = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: (theme) => theme.palette.divider }}>
        <Tabs value={activeTab} onChange={handleChange} aria-label="Panel configuration tabs">
          {tabs.map(({ label }, i) => {
            return (
              <Tab
                key={label}
                label={label}
                id={`options-editor-tab-${i}`}
                aria-controls={`options-editor-tabpanel-${i}`}
              />
            );
          })}
        </Tabs>
      </Box>
      {tabs.map(({ label, content }, i) => {
        return (
          <TabPanel key={label} value={activeTab} index={i}>
            {content}
          </TabPanel>
        );
      })}
    </>
  );
};
