import type http from 'http';

import type { ENV, ModuleConstructor } from '@rocket.chat/fuel';
import {
	RocketChatFuel,
	InterProcessCommunicationDriverTypes,
	injectable,
	LOG_LEVEL,
	Module,
	ConfigModule,
	INJECTION_SCOPE,
	FUEL_DI_TOKENS,
	parseEnvFile,
} from '@rocket.chat/fuel';
import { ILogger, inject } from '@rocket.chat/fuel/dist/internals';
import type createServer from 'connect';
import { WebApp } from 'meteor/webapp';

import { TeamCollaborationEnterprise } from '../../ee/server/proposal/team-collaboration/team-collaboration.module';
import { APIGatewayModule } from './api-gateway/api-gateway.module';
import { envFileValidationSchema } from './env-file-validation-schema';
import { IAMModule } from './iam/iam.module';
import { TeamCollaborationModule } from './team-collaboration/team-collaboration.module';

const envFilePath = Assets.absoluteFilePath('.env');

if (!envFilePath) {
	throw new Error('Could not find the .env file path');
}

const ENV_VALIDATION = {
	allowUnknown: false,
	validationSchema: envFileValidationSchema,
	envFilePath,
};

@injectable()
class MonolithModule extends Module {
	constructor(@inject(FUEL_DI_TOKENS.LOGGER) private logger: ILogger) {
		super();
	}

	public async onStartModule() {
		this.logger.info('Monolith Module Started');
	}

	public async onStartupApplication(): Promise<void> {
		this.logger.info('Monolith Application Started');
	}

	public static modules(): ModuleConstructor[] {
		ConfigModule.configure([
			{
				token: FUEL_DI_TOKENS.CONFIG_OPTIONS,
				value: ENV_VALIDATION,
				scope: INJECTION_SCOPE.VALUE,
			},
		]);

		return [ConfigModule, APIGatewayModule, TeamCollaborationModule, IAMModule];
	}

	public async onStopModule(): Promise<void> {
		this.logger.info('Monolith Module Stopped');
	}

	public async onShutdownApplication(_: string): Promise<void> {
		this.logger.info('Monolith Application Stopped');
	}
}
export const validateAndReturnEnvFile = (): Record<string, any> => parseEnvFile(ENV_VALIDATION);

export const monolithApplication = <T extends RocketChatFuel>(
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
	const dbName = /^mongodb:\/\/.*?(?::[0-9]+)?\/([^?]*)/.exec(MONGO_URL)?.[1] || '';
	if (!dbName) {
		throw new Error('Could not extract the DB name from the provided DB url');
	}

	// eslint-disable-next-line new-cap
	return new applicationConstructor()
		.withMainModule(MonolithModule)
		.withEnterpriseModules([TeamCollaborationEnterprise])
		.withExternalHttpRouter({
			config: {
				cors: true,
				development: NODE_ENV === 'development',
				validateInput: true,
				transformInputWhenRequired: true,
				docs: {
					enabled: NODE_ENV !== 'production',
					routePath: '/rest-api/v2/docs',
					title: 'Rocket.Chat',
					description: 'Rocket.Chat Rest API',
					version: '7.0.0',
					securitySchemes: {
						apiKey: {
							type: 'apiKey',
							in: 'header',
							name: 'X-API',
						},
					},
				},
			},
			onUpdateCallback: async (server: http.Server) => {
				WebApp.connectHandlers.use(server as unknown as createServer.Server);
			},
		})
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
			serviceName: 'Meteor-monolith',
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
		}) as any; // TODO: fix this type
};

export const runApplication = async (): Promise<void> => monolithApplication(RocketChatFuel, validateAndReturnEnvFile()).start();
