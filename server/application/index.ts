import { API } from './api';

export const setupEntrypoints = () => {
	new API().run();
}