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

import { Slider, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { OptionsEditorControl, OptionsEditorGroup } from '@perses-dev/components';
import {
  DEFAULT_AREA_SHADING,
  DEFAULT_LINE_WIDTH,
  DEFAULT_POINT_RADIUS,
  VISUAL_CONFIG,
  VisualOptions,
} from './time-series-chart-model';

export interface VisualOptionsEditorProps {
  value: VisualOptions;
  onChange: (visual: VisualOptions) => void;
}

export function VisualOptionsEditor({ value, onChange }: VisualOptionsEditorProps) {
  const handlePointRadiusChange = (_: Event, sliderValue: number | number[]) => {
    const newValue = Array.isArray(sliderValue) ? sliderValue[0] : sliderValue;
    onChange({
      ...value,
      point_radius: newValue,
    });
  };

  const handleLineWidthChange = (_: Event, sliderValue: number | number[]) => {
    const newValue = Array.isArray(sliderValue) ? sliderValue[0] : sliderValue;
    onChange({
      ...value,
      line_width: newValue,
    });
  };

  return (
    <OptionsEditorGroup title="Visual">
      <OptionsEditorControl
        label={VISUAL_CONFIG.point_radius.label}
        control={
          <Slider
            data-testid={VISUAL_CONFIG.point_radius.testId}
            value={value.point_radius ?? DEFAULT_POINT_RADIUS}
            valueLabelDisplay="auto"
            step={VISUAL_CONFIG.point_radius.step}
            marks
            min={VISUAL_CONFIG.point_radius.min}
            max={VISUAL_CONFIG.point_radius.max}
            onChange={handlePointRadiusChange}
          />
        }
      />
      <OptionsEditorControl
        label={VISUAL_CONFIG.line_width.label}
        control={
          <Slider
            data-testid={VISUAL_CONFIG.line_width.testId}
            value={value.line_width ?? DEFAULT_LINE_WIDTH}
            valueLabelDisplay="auto"
            step={VISUAL_CONFIG.line_width.step}
            marks
            min={VISUAL_CONFIG.line_width.min}
            max={VISUAL_CONFIG.line_width.max}
            onChange={handleLineWidthChange}
          />
        }
      />
      <OptionsEditorControl
        label={VISUAL_CONFIG.area_shading.label}
        control={
          <Switch
            checked={value.area_shading ?? DEFAULT_AREA_SHADING}
            onChange={(e) => {
              onChange({
                ...value,
                area_shading: e.target.checked,
              });
            }}
          />
        }
      />
      <OptionsEditorControl
        label={VISUAL_CONFIG.stacking.label}
        control={
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={value.stacking}
            onChange={(__, newValue) => {
              onChange({
                ...value,
                stacking: newValue,
              });
            }}
          >
            <ToggleButton value="Normal">Normal</ToggleButton>
            <ToggleButton value="Percent">Percent</ToggleButton>
          </ToggleButtonGroup>
        }
      />
    </OptionsEditorGroup>
  );
}
