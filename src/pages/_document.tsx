import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      <script>
        const AlwaysUseSilk = true;
        const SilkVisualMode = true
      </script>
      <script defer src="https://dagammla.gitlab.io/keep-silk-open/keep.js"></script>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
