import { BaseDataBuilder } from '@rocket.chat/fuel/dist/testing';

type NotificationModes = 'all' | 'mentions' | 'nothing' | 'default';

class UserPreferences {
	desktopNotifications?: NotificationModes;

	pushNotifications?: NotificationModes;

	emailNotificationMode?: NotificationModes;

	highlights?: string[];
}

export class UserPreferencesBuilder extends BaseDataBuilder<UserPreferences> {
	protected entity: UserPreferences;

	private constructor() {
		super();
		this.entity = new UserPreferences();
		this.withDesktopNotifications();
		this.withPushNotifications();
		this.withEmailNotifications();
		this.withHighlights();
	}

	public withDesktopNotifications(mode?: NotificationModes): UserPreferencesBuilder {
		this.entity.desktopNotifications = mode || 'default';

		return this;
	}

	public withPushNotifications(mode?: NotificationModes): UserPreferencesBuilder {
		this.entity.pushNotifications = mode || 'default';

		return this;
	}

	public withEmailNotifications(mode?: NotificationModes): UserPreferencesBuilder {
		this.entity.emailNotificationMode = mode || 'default';

		return this;
	}

	public withHighlights(highlights?: string[]): UserPreferencesBuilder {
		this.entity.highlights = highlights || [this.faker.word.sample()];

		return this;
	}

	static theSettings(count: number): UserPreferencesBuilder[] {
		return new Array(count).fill(undefined).map(() => {
			const roomBuilder = UserPreferencesBuilder.aSettingPreference();
			roomBuilder.withDesktopNotifications();
			roomBuilder.withPushNotifications();
			roomBuilder.withEmailNotifications();
			roomBuilder.withHighlights();

			return new UserPreferencesBuilder();
		});
	}

	public static aSettingPreference(): UserPreferencesBuilder {
		return new UserPreferencesBuilder();
	}
}

class UserLanguage {
	language?: string;
}

export class UserLanguageBuilder extends BaseDataBuilder<UserLanguage> {
	protected entity: UserLanguage;

	private constructor() {
		super();
		this.entity = new UserLanguage();
		this.withLanguage();
	}

	public withLanguage(language?: string): UserLanguageBuilder {
		this.entity.language = language || 'default';

		return this;
	}

	public static aLanguagePreference(): UserLanguageBuilder {
		return new UserLanguageBuilder();
	}
}
