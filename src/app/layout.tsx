import type { Metadata } from "next";
import "@styles/globals.scss";
import RecoilRootWrapper from "@components/Layout/RecoilRootWrapper";
import { ToastProvider } from "@components/Toast/ToastContext";
import AuthProvider from "@components/AuthProvider";

export const metadata: Metadata = {
  title: "MongoDB 매니저",
  description: "MongoDB 데이터베이스를 쉽게 관리하고 모니터링할 수 있는 웹 기반 도구입니다. 데이터베이스 구조를 시각화하고, 기본적인 데이터 작업을 빠르고 효율적으로 수행할 수 있도록 설계되었습니다. 개발자와 데이터베이스 관리자가 작업 효율성을 높이고, 직관적인 데이터 관리를 할 수 있도록 도와줍니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="a2fgyHnx6CNoDmHMVOuzQTV4DQqn7a-WQkMF8YNLXvw" />
      </head>
      <body>
        <RecoilRootWrapper>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </RecoilRootWrapper>
      </body>
    </html>
  );
}
