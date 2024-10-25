import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, easeOut } from 'framer-motion';
import { Pretendard } from '@public/fonts';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
    }
  };

  return (
    <ToastContainer
      className={Pretendard.className}
      type={type}
      initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.9 }}
      animate={{ opacity: 1, y: 0, x: '-50%', scale: 1, transition: { duration: 0.1, ease: easeOut } }}
      exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.95, transition: { duration: 0.2, ease: easeOut } }}
    >
      <IconContainer>{getIcon()}</IconContainer>
      {message}
    </ToastContainer>
  );
};

export default Toast;

const ToastContainer = styled(motion.div) <{ type: ToastType }>`
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.875rem 1.25rem;
  
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  color: var(--color-default);
  font-weight: 400;
  font-size: 0.875rem;
  
  z-index: 1000;

  user-select: none;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return 'background-color: #10B981;';
      case 'error':
        return 'background-color: var(--color-red-4);';
      case 'info':
        return 'background-color: #3B82F6;';
    }
  }}
`
const IconContainer = styled.span`
  margin-right: 0.75rem;
  margin-top: 0.1875rem;
  font-size: 0.875rem;
`