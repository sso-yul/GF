import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './useAuthStore';
import { getCookie } from '../api/api.cookie';
import { SigninResponse } from './types';

export const useAuth = () => {
  const { isLoggedIn, user, signin, signout } = useAuthStore();
  const navigate = useNavigate();

  // 로그인 상태 확인
  const checkAuth = () => {
    const token = getCookie('gf_token');
    return !!token;
  };

  // 로그인 상태 확인 및 리다이렉트
  const requireAuth = (redirectTo: string = '/signin') => {
    if (!checkAuth()) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  // 로그인 후 리다이렉트
  const loginWithRedirect = async (
    userId: string, 
    password: string, 
    redirectTo: string = '/'
  ): Promise<SigninResponse> => {
    try {
      const response = await signin(userId, password);
      navigate(redirectTo);
      return response;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  // 로그아웃 후 리다이렉트
  const logoutWithRedirect = async (redirectTo: string = '/signin') => {
    try {
      await signout();
      navigate(redirectTo);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  return {
    isLoggedIn,
    user,
    signin,
    signout,
    checkAuth,
    requireAuth,
    loginWithRedirect,
    logoutWithRedirect
  };
};

// 보호된 라우트를 위한 HOC
export const withAuth = (Component: React.ComponentType) => {
  return (props: any) => {
    const { requireAuth } = useAuth();
    
    useEffect(() => {
      requireAuth();
    }, []);

    return <Component {...props} />;
  };
};