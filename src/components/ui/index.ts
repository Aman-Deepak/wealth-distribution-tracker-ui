// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card, CardHeader, CardBody, CardFooter } from './Card';
export { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
export { Alert, Toast, LoadingSpinner } from './Alert';

// These will now work without TypeScript errors:
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card';
export type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps } from './Modal';
export type { AlertProps, ToastProps, LoadingSpinnerProps } from './Alert';
