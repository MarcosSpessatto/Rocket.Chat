import { API } from '../../../../app/api';

interface IAPIResponse {
	statusCode: number;
	body: any;
}

export const success = (data: any): IAPIResponse => API.v1.success(data);
