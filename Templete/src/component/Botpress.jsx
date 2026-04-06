import React, { useEffect } from 'react';

const Botpress = () => {
  useEffect(() => {
    const injectScript = () => {
      if (window.botpressWebChat) {
        // Already initialized
        window.botpressWebChat.sendEvent({ type: 'show' });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v2.4/inject.js';
      script.async = true;
      script.onload = () => {
        window.botpressWebChat.init({
          botId: '1bfb6a7b-9360-432d-8911-c163ed0aed7b',
          clientId: '4f6672e9-0bf6-4a87-b1f1-974566092a34',
          selector: '#webchat',
          configuration: {
            color: '#5eb1ef',
            themeMode: 'light',
            fontFamily: 'inter',
            variant: 'soft',
            radius: 1,
            enableReset: true,
          },
        });

        window.botpressWebChat.onEvent(() => {
          window.botpressWebChat.sendEvent({ type: 'show' });
        }, ['webchat:ready']);
      };

      document.body.appendChild(script);
    };

    injectScript();
  }, []);

  return (
    <div
      id="webchat"
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
      }}
    />
  );
};

export default Botpress;
