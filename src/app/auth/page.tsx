'use client'

import { Suspense } from "react";
import styled from "styled-components";
import LoginForm from "@components/LoginForm";
import { Pretendard } from "@public/fonts";

const AuthPage = () => {
  return (
    <Container className={Pretendard.className}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}

export default AuthPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
`