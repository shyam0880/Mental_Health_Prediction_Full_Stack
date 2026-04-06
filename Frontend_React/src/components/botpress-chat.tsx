import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    if ((window as any).botpressWebChat) {
      (window as any).botpressWebChat.sendEvent({ type: "show" });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js";
    script.async = true;
    script.onload = () => {
      (window as any).botpressWebChat.init({
        botId: "1bfb6a7b-9360-432d-8911-c163ed0aed7b",
        clientId: "4f6672e9-0bf6-4a87-b1f1-974566092a34",
        selector: "#bp-webchat",
        configuration: {
          color: "#5eb1ef",
          themeMode: "light",
          fontFamily: "inter",
          variant: "soft",
          radius: 1,
          enableReset: true,
        },
      });
      (window as any).botpressWebChat.onEvent(() => {
        (window as any).botpressWebChat.sendEvent({ type: "show" });
      }, ["webchat:ready"]);
    };

    document.body.appendChild(script);

    return () => {
      if ((window as any).botpressWebChat) {
        try { (window as any).botpressWebChat.sendEvent({ type: "hide" }); } catch (_) {}
      }
    };
  }, []);

  return (
    <div id="bp-webchat" style={{ width: "100%", height: "100%", minHeight: "500px" }} />
  );
}
