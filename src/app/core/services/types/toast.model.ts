export enum ToastSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface Toast {
  severity: ToastSeverity;
  text: string;
}
