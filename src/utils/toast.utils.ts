import { toast } from 'react-hot-toast'

export const notify = {
  success: (message: string) =>
    toast(message, {
      icon: '🟢',
    }),
  error: (message: string) =>
    toast(message, {
      icon: '🔴',
    }),
  warning: (message: string) =>
    toast(message, {
      icon: '🟡',
    }),
}
