import React from 'react';
import { Toaster } from 'sonner';

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          color: 'black',
        },
      }}
    />
  );
}