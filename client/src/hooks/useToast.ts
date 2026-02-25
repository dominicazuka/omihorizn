/**
 * Unified Toast Hook for React Native (iOS/Android) + Web
 * Abstracts platform differences between react-native-toast-message and react-toastify
 */

import Toast from 'react-native-toast-message';
import { toast as toastify } from 'react-toastify';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom';
}

/**
 * Unified toast hook that works across all platforms
 * @example
 * const toast = useToast();
 * toast.success('Operation successful!');
 * toast.error('Something went wrong');
 */
export const useToast = () => {
  // Detect if running on web or native
  const isWeb = typeof window !== 'undefined' && !('ExpoConstants' in global);

  const show = (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
    const duration = options.duration || 3000;

    if (isWeb) {
      // Web: Use react-toastify
      toastify(message, {
        type,
        autoClose: duration,
        position: 'bottom-right',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      // Native (iOS/Android): Use react-native-toast-message
      Toast.show({
        type: type === 'warning' ? 'info' : type, // Toast doesn't have 'warning'
        position: options.position === 'top' ? 'top' : 'bottom',
        text1: message,
        visibilityTime: duration,
      });
    }
  };

  return {
    success: (message: string, options?: ToastOptions) => show(message, 'success', options),
    error: (message: string, options?: ToastOptions) => show(message, 'error', options),
    info: (message: string, options?: ToastOptions) => show(message, 'info', options),
    warning: (message: string, options?: ToastOptions) => show(message, 'warning', options),
  };
};

export default useToast;
