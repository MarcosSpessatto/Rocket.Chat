import { BaseDataBuilder } from '@rocket.chat/fuel/dist/testing';

class WorkspaceSettings {
	autoTranslateWhenJoiningRoom: boolean;

	language: string;
}

export class WorkspaceSettingsBuilder extends BaseDataBuilder<WorkspaceSettings> {
	protected entity: WorkspaceSettings;

	private constructor() {
		super();
		this.entity = new WorkspaceSettings();
		this.withAutoTranslateWhenJoiningRoom();
		this.withLanguage();
	}

	public withAutoTranslateWhenJoiningRoom(value?: boolean): WorkspaceSettingsBuilder {
		this.entity.autoTranslateWhenJoiningRoom = value || false;

		return this;
	}

	public withLanguage(language?: string): WorkspaceSettingsBuilder {
		this.entity.language = language || 'en-us';

		return this;
	}

	public static aSetting(): WorkspaceSettingsBuilder {
		return new WorkspaceSettingsBuilder();
	}
}
