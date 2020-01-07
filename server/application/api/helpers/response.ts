import { API } from '../../../../app/api';

interface IAPIResponse {
	statusCode: number;
	body: any;
}

export const success = (data: any): IAPIResponse => API.v1.success(data);
export const unauthorized = (msg?: string): IAPIResponse => API.v1.unauthorized(msg);
export const notFound = (msg?: string): IAPIResponse => API.v1.notFound(msg);
