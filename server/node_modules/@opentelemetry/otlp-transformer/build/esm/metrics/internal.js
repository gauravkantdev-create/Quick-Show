/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ValueType } from '@opentelemetry/api';
import { AggregationTemporality, DataPointType, } from '@opentelemetry/sdk-metrics';
import { EAggregationTemporality, } from './internal-types';
import { createInstrumentationScope, createResource, toAttributes, } from '../common/internal';
export function toResourceMetrics(resourceMetrics, encoder) {
    const processedResource = createResource(resourceMetrics.resource, encoder);
    return {
        resource: processedResource,
        schemaUrl: processedResource.schemaUrl,
        scopeMetrics: toScopeMetrics(resourceMetrics.scopeMetrics, encoder),
    };
}
export function toScopeMetrics(scopeMetrics, encoder) {
    return Array.from(scopeMetrics.map(metrics => ({
        scope: createInstrumentationScope(metrics.scope),
        metrics: metrics.metrics.map(metricData => toMetric(metricData, encoder)),
        schemaUrl: metrics.scope.schemaUrl,
    })));
}
export function toMetric(metricData, encoder) {
    const out = {
        name: metricData.descriptor.name,
        description: metricData.descriptor.description,
        unit: metricData.descriptor.unit,
    };
    const aggregationTemporality = toAggregationTemporality(metricData.aggregationTemporality);
    switch (metricData.dataPointType) {
        case DataPointType.SUM:
            out.sum = {
                aggregationTemporality,
                isMonotonic: metricData.isMonotonic,
                dataPoints: toSingularDataPoints(metricData, encoder),
            };
            break;
        case DataPointType.GAUGE:
            out.gauge = {
                dataPoints: toSingularDataPoints(metricData, encoder),
            };
            break;
        case DataPointType.HISTOGRAM:
            out.histogram = {
                aggregationTemporality,
                dataPoints: toHistogramDataPoints(metricData, encoder),
            };
            break;
        case DataPointType.EXPONENTIAL_HISTOGRAM:
            out.exponentialHistogram = {
                aggregationTemporality,
                dataPoints: toExponentialHistogramDataPoints(metricData, encoder),
            };
            break;
    }
    return out;
}
function toSingularDataPoint(dataPoint, valueType, encoder) {
    const out = {
        attributes: toAttributes(dataPoint.attributes, encoder),
        startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
        timeUnixNano: encoder.encodeHrTime(dataPoint.endTime),
    };
    switch (valueType) {
        case ValueType.INT:
            out.asInt = dataPoint.value;
            break;
        case ValueType.DOUBLE:
            out.asDouble = dataPoint.value;
            break;
    }
    return out;
}
function toSingularDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(dataPoint => {
        return toSingularDataPoint(dataPoint, metricData.descriptor.valueType, encoder);
    });
}
function toHistogramDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(dataPoint => {
        const histogram = dataPoint.value;
        return {
            attributes: toAttributes(dataPoint.attributes, encoder),
            bucketCounts: histogram.buckets.counts,
            explicitBounds: histogram.buckets.boundaries,
            count: histogram.count,
            sum: histogram.sum,
            min: histogram.min,
            max: histogram.max,
            startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
            timeUnixNano: encoder.encodeHrTime(dataPoint.endTime),
        };
    });
}
function toExponentialHistogramDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(dataPoint => {
        const histogram = dataPoint.value;
        return {
            attributes: toAttributes(dataPoint.attributes, encoder),
            count: histogram.count,
            min: histogram.min,
            max: histogram.max,
            sum: histogram.sum,
            positive: {
                offset: histogram.positive.offset,
                bucketCounts: histogram.positive.bucketCounts,
            },
            negative: {
                offset: histogram.negative.offset,
                bucketCounts: histogram.negative.bucketCounts,
            },
            scale: histogram.scale,
            zeroCount: histogram.zeroCount,
            startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
            timeUnixNano: encoder.encodeHrTime(dataPoint.endTime),
        };
    });
}
function toAggregationTemporality(temporality) {
    switch (temporality) {
        case AggregationTemporality.DELTA:
            return EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
        case AggregationTemporality.CUMULATIVE:
            return EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE;
    }
}
export function createExportMetricsServiceRequest(resourceMetrics, encoder) {
    return {
        resourceMetrics: resourceMetrics.map(metrics => toResourceMetrics(metrics, encoder)),
    };
}
//# sourceMappingURL=internal.js.map