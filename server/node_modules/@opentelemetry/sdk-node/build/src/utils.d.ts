import { ContextManager, TextMapPropagator } from '@opentelemetry/api';
import { ResourceDetector } from '@opentelemetry/resources';
import { SpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ConfigurationModel } from '@opentelemetry/configuration';
import { IMetricReader, PushMetricExporter } from '@opentelemetry/sdk-metrics';
import { BatchLogRecordProcessor, BufferConfig, LogRecordExporter, LoggerProviderConfig } from '@opentelemetry/sdk-logs';
export declare function getResourceDetectorsFromEnv(): Array<ResourceDetector>;
export declare function getOtlpProtocolFromEnv(): string;
export declare function getSpanProcessorsFromEnv(): SpanProcessor[];
/**
 * Get a propagator as defined by environment variables
 */
export declare function getPropagatorFromEnv(): TextMapPropagator | null | undefined;
/**
 * Get a propagator as defined by configuration model from configuration
 */
export declare function getPropagatorFromConfiguration(config: ConfigurationModel): TextMapPropagator | null | undefined;
export declare function setupContextManager(contextManager: ContextManager | null | undefined): void;
export declare function setupDefaultContextManager(): void;
export declare function setupPropagator(propagator: TextMapPropagator | null | undefined): void;
export declare function getKeyListFromObjectArray(obj: object[] | undefined): string[] | undefined;
export declare function getNonNegativeNumberFromEnv(envVarName: string): number | undefined;
export declare function getPeriodicExportingMetricReaderFromEnv(exporter: PushMetricExporter): IMetricReader;
export declare function getOtlpMetricExporterFromEnv(): PushMetricExporter;
/**
 * Get LoggerProviderConfig from environment variables.
 */
export declare function getLoggerProviderConfigFromEnv(): LoggerProviderConfig;
/**
 * Get configuration for BatchLogRecordProcessor from environment variables.
 */
export declare function getBatchLogRecordProcessorConfigFromEnv(): BufferConfig;
export declare function getBatchLogRecordProcessorFromEnv(exporter: LogRecordExporter): BatchLogRecordProcessor;
//# sourceMappingURL=utils.d.ts.map