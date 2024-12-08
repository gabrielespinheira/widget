import { useConfigData } from "@lib/providers/ConfigDataProvider";
import type { BotMessageType } from "@lib/types";
import React, { type ComponentType } from "react";

interface BotMessageProps<W extends React.ElementType> {
  message: BotMessageType;
  Wrapper?: W;
  wrapperProps?: Omit<React.ComponentProps<W>, "children">;
}

export function BotMessage<W extends React.ElementType>({
  message,
  Wrapper,
  wrapperProps,
}: BotMessageProps<W>) {
  const config = useConfigData();

  const Component = config.componentStore.getComponent(
    message.component,
    config.debug
  ) as ComponentType<{
    data: BotMessageType["data"];
    id: string;
  }>;

  if (!Component) {
    return null;
  }


  if (!Wrapper) {
    return <Component {...message} id={message.id} key={message.id} />;
  }

  return (
    // @ts-ignore
    <Wrapper {...wrapperProps} key={message.id}>
      <Component {...message} id={message.id} />
    </Wrapper>
  );
}
