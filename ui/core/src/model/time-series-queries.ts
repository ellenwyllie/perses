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

import { UnknownSpec } from './definitions';
import { QueryDefinition } from './query';
import { UnixTimeMs } from './time';

export type TimeSeriesQueryDefinition<PluginSpec = UnknownSpec> = QueryDefinition<'TimeSeriesQuery', PluginSpec>;

// export type TimeSeriesValueTuple = [timestamp: UnixTimeMs, value: number | null];
export type TimeSeriesValueTuple = [timestamp: UnixTimeMs, value: number]; // TODO: fix null for graphite to work with dataset

export type Labels = Record<string, string>;
