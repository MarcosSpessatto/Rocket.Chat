import path from 'path';

import type { ENV, ModuleConstructor, RocketChatFuel } from '@rocket.chat/fuel';
import {
	ConfigModule,
	FUEL_DI_TOKENS,
	ILogger,
	inject,
	injectable,
	INJECTION_SCOPE,
	InterProcessCommunicationDriverTypes,
	LOG_LEVEL,
	Module,
	parseEnvFile,
} from '@rocket.chat/fuel';

import { envFileValidationSchema } from './env-file-validation-schema';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ServicesModule } from './services/services.module';

const envFilePath = path.resolve('.env');

if (!envFilePath) {
	throw new Error('Could not find the .env file path');
}
const ENV_VALIDATION = {
	allowUnknown: false,
	validationSchema: envFileValidationSchema,
	envFilePath,
};

@injectable()
class OmnichannelModule extends Module {
	constructor(@inject(FUEL_DI_TOKENS.LOGGER) private logger: ILogger) {
		super();
	}

	public async onStartModule(): Promise<void> {
		this.logger.info('Omnichannel Module Started');
	}

	public async onStartupApplication(): Promise<void> {
		this.logger.info('Omnichannel Application Started');
	}

	public static modules(): ModuleConstructor[] {
		ConfigModule.configure([
			{
				token: FUEL_DI_TOKENS.CONFIG_OPTIONS,
				value: ENV_VALIDATION,
				scope: INJECTION_SCOPE.VALUE,
			},
		]);

		return [ConfigModule, InfrastructureModule, ServicesModule];
	}

	public async onStopModule(): Promise<void> {
		this.logger.info('Omnichannel Module Stopped');
	}

	public async onShutdownApplication(_: string): Promise<void> {
		this.logger.info('Omnichannel Application Stopped');
	}
}

export const validateAndReturnEnvFile = (): Record<string, any> => parseEnvFile(ENV_VALIDATION);

export const buildModule = <T extends RocketChatFuel>(
	applicationConstructor: new (...args: any[]) => T,
	envFileContent: Record<string, any>,
): T => {
	const {
		MONGO_URL = '',
		TELEMETRY_LOGS_EXPORTER_URL = '',
		TELEMETRY_METRICS_EXPORTER_URL = '',
		TELEMETRY_TRACING_EXPORTER_URL = '',
		NODE_ENV = 'development',
		INTER_COMMUNICATION_DRIVER = 'moleculer',
		INTER_COMMUNICATION_DRIVER_URL = '',
	} = envFileContent;

	const dbName = /^mongodb:\/\/.*?(?::[0-9]+)?\/([^?]*)/.exec(envFileContent.MONGO_URL)?.[1] || '';
	if (!dbName) {
		throw new Error('Could not extract the DB name from the provided DB url');
	}
	const application = new applicationConstructor()
		.withMainModule(OmnichannelModule)
		.withDatabase({
			url: MONGO_URL,
			database: dbName,
		})
		.withInterProcessCommunication({
			driver:
				INTER_COMMUNICATION_DRIVER === 'moleculer'
					? InterProcessCommunicationDriverTypes.MOLECULER
					: InterProcessCommunicationDriverTypes.NATS,
			url: INTER_COMMUNICATION_DRIVER_URL,
		})
		.withObservability({
			serviceName: 'Omnichannel',
			env: NODE_ENV as ENV,
			telemetry: {
				logExporterUrl: TELEMETRY_LOGS_EXPORTER_URL,
				metricsExporterUrl: TELEMETRY_METRICS_EXPORTER_URL,
				traceExporterUrl: TELEMETRY_TRACING_EXPORTER_URL,
			},
			logger: {
				useLocal: false,
				overrideStdout: true,
				lessInfoLogs: true,
				defaultLevel: LOG_LEVEL.WARN,
			},
		});

	return application as any; // TODO: fix type
};
