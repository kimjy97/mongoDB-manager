'use client'

import { apiKeyState } from '@/atoms/global';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

interface IProps {
  children: any;
}

const AuthProvider = ({ children }: IProps) => {
  const [apiKey, setApiKey] = useRecoilState(apiKeyState);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const key = localStorage.getItem('apiKey');
    const database = localStorage.getItem('database') || 'test';

    if (key && !apiKey) {
      setApiKey(key);
      router.push(`/documents?database=${database}`);
    } else {
      if (!apiKey) router.push('/auth');
    }
  }, [pathname]);

  return apiKey || pathname === '/auth' ? children : null;
};

export default AuthProvider;
