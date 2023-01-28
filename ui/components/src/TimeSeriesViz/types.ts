import { DataQueryResponse, DataQueryRequest } from '@grafana/data';

export type FrameworkContext = any;

/**
 * Datasource
 */
export abstract class Datasource {
  query?(req: DataQueryRequest<any>, ctx?: FrameworkContext): Promise<DataQueryResponse>;

  annotationQuery?(req: AnnotationQueryRequest, ctx?: FrameworkContext): Promise<Annotation[]>;

  templateVariableQuery?(req: TemplateVariableRequest, ctx?: FrameworkContext): Promise<TemplateVariable[]>;
}

/**
 * Annotations
 */
export interface Annotation {
  time: number;
  title: string;
  endTime?: number;
  description?: string;
  payload?: any;
  color?: string;
}

/**
 * Templates
 */

export interface TemplateVariable {
  label?: string;
  value: string;
}

export interface TemplateVariableRequest {}

export interface AnnotationQueryRequest {
  startTime: number;
  endTime: number;
  query: AnnotationQuery;
}

export type AnnotationQuery = string;

/**
 * Time based
 */
export interface TimeRange {
  startTime: DateTimeFormat;
  endTime: DateTimeFormat;
}

// Supports relative time (5s, 1m, etc),  or "off"
export type DurationString = string;
export type RefreshInterval = DurationString | 'off';
// Supports unix time, ISO string, a relative durations (e.g. 6h, now)
export type DateTimeFormat = number | string;
