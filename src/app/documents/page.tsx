'use client'

import styled from "styled-components";
import Collections from "@components/Collections";
import Modal from "@components/Modal";
import { Pretendard } from "@public/fonts";
import Documents from "@components/Documents";

const DocumentPage = () => {
  return (
    <Container className={Pretendard.className}>
      <Collections />
      <Documents />
      <Modal.CopyDocument />
      <Modal.DeleteDocument />
      <Modal.AddDocument />
      <Modal.DeleteCollection />
      <Modal.CreateCollection />
    </Container>
  );
}

export default DocumentPage;

const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
`