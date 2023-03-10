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

import { RequestHeaders, UnknownSpec } from '@perses-dev/core';
import { Plugin } from './plugin-base';

/**
 * Plugin that defines options for an external system that Perses talks to for data.
 */
export interface DatasourcePlugin<Spec = UnknownSpec, Client = unknown> extends Plugin<Spec> {
  createClient: (spec: Spec, options: DatasourceClientOptions) => Client;
}

export interface DatasourceClientOptions {
  proxyUrl?: string;
}

/**
 * Common properties for all clients
 */
export interface DatasourceClient {
  options: {
    datasourceUrl: string;
    headers?: RequestHeaders;
    // timeout?: number; // maximum time allowed before fail
    // retry?: number; // failed request retries
    // cache?: boolean; // whether to cache responses
  };
  [key: string]: unknown;
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [key: string]: any;
  // onRequest?: (config: any) => any;
  // onResponse?: (response: any) => any;
  // onError?: (error: any) => any;
  // transformRequest?: (data: any) => any;
  // transformResponse?: (data: any) => any;
}

/**
 * Determine if valid input is a valid DatasourceClient
 */
export function isDatasourceClient(client: unknown): client is DatasourceClient {
  return (client as DatasourceClient).options.datasourceUrl !== undefined;
}
