import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from './utils/cn';
import { Wobble } from './wobble';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <Wobble ref={ref}>
    <SwitchPrimitives.Root
      className={cn(
        'peer group inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
          'group-active:scale-90 group-hover:active:scale-90',
        )}
      />
    </SwitchPrimitives.Root>
  </Wobble>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
