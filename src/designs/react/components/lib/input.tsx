import * as React from 'react';
import { cn } from './utils/cn';
import { Wobble } from './wobble';
import { useDocumentDir } from '../../../../headless/react/hooks/useDocumentDir';
import { useIsSmallScreen } from '../../hooks/useIsSmallScreen';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { isSmallScreen } = useIsSmallScreen();
    const direction = useDocumentDir();

    return (
      <Wobble ref={ref}>
        <input
          dir={direction}
          type={type}
          className={cn(
            // 16px on mobiles prevents auto-zoom on the input when focused
            isSmallScreen ? 'text-[16px]' : 'text-sm',
            'flex w-full rounded-xl p-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary-foreground placeholder:text-muted-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition',
            'rtl:placeholder:text-right',
            'rounded-2xl px-4',
            'border shadow-sm',
            className,
          )}
          {...props}
        />
      </Wobble>
    );
  },
);
Input.displayName = 'Input';

export { Input };
