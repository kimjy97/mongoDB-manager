'use client';

import { RecoilRoot } from 'recoil';
import React from 'react';

interface RecoilRootWrapperProps {
  children: React.ReactNode;
}

const RecoilRootWrapper = ({
  children,
}: RecoilRootWrapperProps) => {
  return <RecoilRoot>{children}</RecoilRoot>;
}

export default RecoilRootWrapper;