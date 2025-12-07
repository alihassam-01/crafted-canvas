import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const isLoggedIn = !!userData?.data;
  const user = userData?.data;

  return {
    isLoggedIn,
    user,
    isLoading,
  };
}
