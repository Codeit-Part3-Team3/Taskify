import { axiosInstance } from '@/src/app/_util/axiosInstance';

export async function getInvitations(dashboardId: string | undefined, page: number, size: number) {
  try {
    const response = await axiosInstance.get(`dashboards/${dashboardId}/invitations?page=${page}&size=${size}`);
    const result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getMembers(dashboardId: string | undefined, page: number, size: number) {
  try {
    const response = await axiosInstance.get(`members?page=${page}&size=${size}&dashboardId=${dashboardId}`);
    const result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
}