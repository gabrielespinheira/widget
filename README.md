# OpenCX Widget

## Getting Started

### Embedded in HTML

```html
<head>
  <script src="https://unpkg.com/@opencx/widget@latest/dist-embed/script.js"></script>
  <script>
    const options = {
      token: 'your-token-here',
    };
    window.addEventListener('DOMContentLoaded', () => {
      initOpenScript(options);
    });
  </script>
</head>
```

### Default React Widget

Install the package:

```bash
pnpm add @opencx/widget
```

Render the widget:

```tsx
import { Widget } from '@opencx/widget/designs';

function YourComponent() {
  return (
    <Widget
      options={{
        token: 'your-token-here',
      }}
    />
  );
}
```

### Framework-Agnostic Headless Widget

The core package exports the widget engine that can be used with any framework:

- Check the [`React` adapter](https://github.com/openchatai/widget/tree/main/src/headless/react) on how to attach the widget engine to a framework.
- Check the [default `React` widget](https://github.com/openchatai/widget/tree/main/src/designs/react) on how to use the engine; collecting user data, navigating between screens, sending messages, handling loading states, etc.

## Widget Options

- [Available options](https://github.com/openchatai/widget/tree/main/src/headless/core/types/widget-config.ts)
- [Usage example](https://github.com/openchatai/widget/tree/main/index.tsx)

## Authentication

The widget supports a variety of ways to authenticate, or not, your users:

1. **Completely anonymous**: Leave `WidgetConfig.collectUserData` and `WidgetConfig.user` empty or explicitly `undefined`
2. **Manually collect user data**: Pass `WidgetConfig.collectUserData` as `true`
   - Users will have to input a `name` and an `email` to enter the chat.
   - A contact will be created with the inputted email. But the session will be considered `unverified`, since the user can input any `email`.
   - The user will be saved in `localStorage` and they won't have to input a `name` and `email` on future visits.
3. **Programmatically pass user data**: Populate `WidgetConfig.user.data` with a `name` and `email`
   - The session will still be considered `unverified`, because malicious users can still intercept outgoing browser requests and tamper with the user data
   - If `WidgetConfig.collectUserData` is `true` and `WidgetConfig.user.data.email` was also passed, the `email` will take precedence and `collectUserData` will be ignored.
4. **Secure authentication**: Get a `token` for your user by letting your backend hit a request to `api.open.cx/widget/authenticate-user` ([API reference](https://docs.open.cx/api-reference/widget/authenticate-contact)) and pass the token in `WidgetConfig.user.token`
   - The session will be `verified`, so your human agents can share private data with the user (in case the session was handed-over to humans)
   - `customData` in the authentication request will be saved, since contacts have no way to tamper with them

## Workspace Management

If you support multiple workspaces per user or contact, you can pass the user's workspace id in `WidgetConfig.user.externalId`. This way, sessions will be scoped by that external id.
