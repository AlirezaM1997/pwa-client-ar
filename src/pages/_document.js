import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_PUBLISH_DOMAIN + "/assets/images/logo-mofid-fa.png"} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_PUBLISH_DOMAIN} />
        <meta name="title" content="مفید" />
        <meta name="description" content="#با_همدیگر_مفید_خواهیم_بود" />
        <script defer src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script defer src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="/googletagmanager.js"></script>
        {/* {process.env.NODE_ENV !== "development" && (
          <script type="text/javascript" src="/fullstory.js"></script>
        )} */}
        {/* {process.env.NODE_ENV !== "development" && (
          <script type="text/javascript" src="/raychat.js"></script>
        )}
        {process.env.NODE_ENV === "development" && (
          <script type="text/javascript" src="/raychat-test.js"></script>
        )} */}
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T7LL8T75"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
