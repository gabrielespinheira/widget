import { SendHorizontal, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { z } from 'zod';
import {
  useConfig,
  useContact,
  usePreludeData,
  useWidgetTrigger,
} from '../../../../headless/react';
import { Button } from '../../components/lib/button';
import { Input } from '../../components/lib/input';
import { MotionDiv } from '../../components/lib/MotionDiv';
import { cn } from '../../components/lib/utils/cn';
import { PoweredByOpen } from '../../components/PoweredByOpen';
import { useIsSmallScreen } from '../../hooks/useIsSmallScreen';
import { useLocale } from '../../hooks/useLocale';
import { useTheme } from '../../hooks/useTheme';
import { useWidgetContentHeight } from '../../hooks/useWidgetContentHeight';
import { useWidgetSize } from '../../hooks/useWidgetSize';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export function WelcomeScreen() {
  const { setIsOpen } = useWidgetTrigger();
  const { createUnverifiedContact } = useContact();
  const { isSmallScreen } = useIsSmallScreen();
  const config = useConfig();
  const { theme } = useTheme();
  const locale = useLocale();
  const { data: preludeData } = usePreludeData();
  const { observedElementRef } = useWidgetContentHeight();

  useWidgetSize({
    height: undefined,
    width: theme.screens.welcome.width,
  });

  const [name, setName] = useState(config.prefillUserData?.name || '');
  const [email, setEmail] = useState(config.prefillUserData?.email || '');

  const extraDataFields = (config.extraDataCollectionFields || []).filter(
    (f) => f !== 'name' && f !== 'email' && !!f,
  );

  const [extraData, setExtraData] = useState<Record<string, string>>({});

  const [handleSubmitState, handleSubmit] = useAsyncFn(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const result = schema.safeParse({ name, email });
      if (result.success) {
        await createUnverifiedContact(
          {
            email: result.data.email,
            non_verified_name: result.data.name,
          },
          // Only pass extra data if there is any
          Object.values(extraData).filter(Boolean).length
            ? extraData
            : undefined,
        );
      }
    },
    [name, email, extraData],
  );

  return (
    <div
      style={{
        width: '100vw', // Relative to the iframe
        maxWidth: '100vw', // Relative to the iframe
        minHeight: theme.screens.welcome.minHeight,
        height: '100vh', // Relative to the iframe
        maxHeight: '100vh', // Relative to the iframe
        overflowY: 'auto',
      }}
    >
      <div
        ref={observedElementRef}
        className={cn(
          'flex flex-col',
          isSmallScreen && 'h-full',
          'bg-[radial-gradient(ellipse_at_top_left,hsl(var(--opencx-primary)),transparent),radial-gradient(ellipse_at_top_right,hsl(var(--opencx-primary)),transparent)]',
        )}
      >
        <div
          dir="auto"
          className={cn(
            'flex-1 flex flex-col px-4 py-12 text-start space-y-4 relative z-10',
            'text-primary-foreground',
          )}
        >
          {isSmallScreen && (
            <MotionDiv className="absolute top-6 right-6">
              <Button size="selfless" onClick={() => setIsOpen(false)}>
                <XIcon className="size-4" />
              </Button>
            </MotionDiv>
          )}

          <div className="flex items-center justify-between w-full mb-2">
            {config.assets?.organizationLogo ? (
              <img
                src={config.assets?.organizationLogo}
                alt="Company Logo"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <h2 className="font-bold text-sm" dir="auto">
                {preludeData?.data?.organizationName}
              </h2>
            )}
          </div>
          <div className="space-y-2">
            <h1
              className="text-[1.75rem] font-semibold tracking-tight leading-none"
              dir="auto"
            >
              {config.textContent?.welcomeScreen?.title ||
                locale.get('welcome-title')}
            </h1>

            <p className="text-sm" dir="auto">
              {config.textContent?.welcomeScreen?.description ||
                locale.get('welcome-description')}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'z-10 m-2 px-2 pt-2 bp-0 space-y-2',
            'bg-[white]',
            'border shadow',
            'rounded-3xl',
          )}
          dir="auto"
        >
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={locale.get('your-name')}
              name="name"
            />
            <Input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={locale.get('your-email')}
              name="email"
            />
            {extraDataFields.map((field) => (
              <Input
                key={field}
                value={extraData[field]}
                onChange={(e) =>
                  setExtraData((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                placeholder={`${field} (${locale.get('optional')})`}
              />
            ))}

            <Button
              disabled={handleSubmitState.loading}
              className="w-full"
              size="lg"
            >
              {handleSubmitState.loading
                ? locale.get('starting-chat')
                : locale.get('start-chat')}
              <SendHorizontal className="size-4 rtl:-scale-100" />
            </Button>
          </form>

          <PoweredByOpen />
        </div>
      </div>
    </div>
  );
}
