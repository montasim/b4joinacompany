import Script from "next/script";

export function SupportKoriWidget() {
  return (
    <Script
      data-color="#FFDD00"
      data-id="montasim"
      data-message="Support montasim"
      data-position="right"
      id="support-kori-widget"
      src="https://www.supportkori.com/widget.js"
      strategy="afterInteractive"
    />
  );
}
