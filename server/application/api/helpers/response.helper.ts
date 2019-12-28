import { API } from '../../../../app/api'

export const success = (data: any) => (API as any).v1.sucess(data);