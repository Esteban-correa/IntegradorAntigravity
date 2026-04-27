import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const kpiKeys = {
  all: ['kpis'],
  dashboard: () => [...kpiKeys.all, 'dashboard'],
};

export const fetchDashboardKpis = async () => {
  const { data } = await apiClient.get('/kpis/dashboard');
  return data;
};

export function useDashboardKpis() {
  return useQuery({
    queryKey: kpiKeys.dashboard(),
    queryFn: fetchDashboardKpis,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
