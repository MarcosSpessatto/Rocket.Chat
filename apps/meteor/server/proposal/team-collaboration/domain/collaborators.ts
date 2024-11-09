export type Collaborator = {
	_id: string;
	username: string;
	name?: string;
	settings?: {
		profile: any;
		preferences?: {
			[key: string]: any;
		};
	};
};

export type Owner = Collaborator;
export type Member = Collaborator;
