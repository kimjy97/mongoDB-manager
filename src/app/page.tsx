'use client'

import styled from "styled-components";
import { Pretendard } from "@public/fonts";
import LoginForm from "@components/LoginForm";

const Home = () => {
  return (
    <Container className={Pretendard.className}>
      <LoginForm />
    </Container>
  );
}

export default Home;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
`