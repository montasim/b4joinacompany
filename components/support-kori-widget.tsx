"use client";

import { Coffee } from "lucide-react";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

export function SupportKoriWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pendingToggle = useRef(false);

  const prepareWidget = useCallback(() => {
    const widgetButton = document.querySelector<HTMLElement>(".sk-widget-btn");
    const widgetPanel = document.querySelector<HTMLElement>(
      ".sk-widget-iframe-container",
    );

    if (!widgetButton || !widgetPanel) return;

    widgetButton.setAttribute("aria-hidden", "true");
    widgetButton.setAttribute("tabindex", "-1");
    widgetPanel.id = "support-kori-panel";
    widgetPanel
      .querySelector("iframe")
      ?.setAttribute("title", "Support this independent project");

    setIsReady(true);
    setIsOpen(widgetPanel.classList.contains("open"));

    if (pendingToggle.current) {
      pendingToggle.current = false;
      widgetButton.click();
      setIsOpen(widgetPanel.classList.contains("open"));
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const widgetPanel = document.querySelector<HTMLElement>(
      ".sk-widget-iframe-container",
    );
    if (!widgetPanel) return;

    const observer = new MutationObserver(() => {
      setIsOpen(widgetPanel.classList.contains("open"));
    });
    observer.observe(widgetPanel, { attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [isReady]);

  function toggleWidget() {
    const widgetButton = document.querySelector<HTMLElement>(".sk-widget-btn");
    const widgetPanel = document.querySelector<HTMLElement>(
      ".sk-widget-iframe-container",
    );

    if (!widgetButton || !widgetPanel) {
      pendingToggle.current = !pendingToggle.current;
      return;
    }

    widgetButton.click();
    setIsOpen(widgetPanel.classList.contains("open"));
  }

  return (
    <>
      <button
        aria-controls="support-kori-panel"
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Close" : "Open"} support panel`}
        className="fixed right-5 bottom-5 z-40 inline-flex min-h-10.5 cursor-pointer items-center gap-2 rounded-lg border-0 bg-white px-3.5 py-2.5 text-xs font-extrabold text-ink shadow-[0_8px_24px_rgb(22_56_61_/_16%)] transition-[color,background-color,box-shadow,transform] hover:bg-jade-soft hover:text-jade-dark hover:shadow-[0_10px_28px_rgb(22_56_61_/_20%)] active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-jade/30 max-sm:right-3.5 max-sm:bottom-[calc(env(safe-area-inset-bottom)+14px)]"
        onClick={toggleWidget}
        type="button"
      >
        <Coffee aria-hidden="true" className="size-4.5 text-jade" />
        <span>Support</span>
      </button>

      <Script
        data-color="#14786e"
        data-id="montasim"
        data-message="Support"
        data-position="right"
        id="support-kori-widget"
        onReady={prepareWidget}
        src="https://www.supportkori.com/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
