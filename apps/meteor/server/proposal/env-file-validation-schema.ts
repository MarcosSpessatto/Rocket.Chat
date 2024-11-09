import { Joi } from '@rocket.chat/fuel';

export const envFileValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'staging', 'testing').default('development'),
	MONGO_URL: Joi.string()
		.pattern(/^(mongodb:(?:\/{2})?)((\w+?):(\w+?)@|:?@?)(\w+?):(\d+)\/(\w+?)$/)
		.required(),
	INTER_COMMUNICATION_DRIVER: Joi.string().valid('nats', 'moleculer').required(),
	INTER_COMMUNICATION_DRIVER_URL: Joi.string()
		.when('INTER_COMMUNICATION_DRIVER', {
			is: 'nats',
			then: Joi.string()
				.pattern(/^((nats?:\/\/)|(www.))(?:([a-zA-Z]+)|(\d+\.\d+.\d+.\d+)):\d{4}$/)
				.required(),
		})
		.concat(Joi.string().when('INTER_COMMUNICATION_DRIVER', { is: 'moleculer', then: Joi.string().valid('TCP').required() })),
	TELEMETRY_LOGS_EXPORTER_URL: Joi.string().uri().required(),
	TELEMETRY_METRICS_EXPORTER_URL: Joi.string().uri().required(),
	TELEMETRY_TRACING_EXPORTER_URL: Joi.string().uri().required(),
});
