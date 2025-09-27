import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import { ToastContextType } from '../types';

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
