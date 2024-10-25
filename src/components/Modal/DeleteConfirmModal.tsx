'use client';

import IconClose from '@mui/icons-material/CloseRounded';
import IconClone from '@mui/icons-material/FileCopyRounded';
import { isDeleteConfirmModalOpenState } from '@/atoms/modal';
import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { deleteDocumentFormState } from '@/atoms/document';
import { useHandleDocument } from '@/hooks/useHandleDocument';
import { currentCollectionState } from '@/atoms/selected';
import { useToast } from '@components/Toast/ToastContext';

const DeleteConfirmModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentCollection,] = useRecoilState(currentCollectionState);
  const [isModalOpen, setIsModalOpen] = useRecoilState(isDeleteConfirmModalOpenState);
  const [currentData, setCurrentData] = useRecoilState(deleteDocumentFormState);
  const { handleDeleteDocument } = useHandleDocument();
  const { showToast } = useToast();

  const handleClose = () => {
    setIsModalOpen(false);
  }

  const handleClickConfirm = async () => {
    await handleDeleteDocument(currentCollection.name, currentData)
      .catch((error) => showToast(error.message, 'error')).finally(() => setIsModalOpen(false));
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleClose]);

  useEffect(() => {
    if (!isModalOpen) {
      setCurrentData(undefined);
    }
  }, [isModalOpen])

  return (
    <Container isOpen={isModalOpen}>
      <ModalContent ref={modalRef} isOpen={isModalOpen}>
        <Header>
          <CloneIcon />
          <p>문서 삭제</p>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Body>
          <Mention>문서를 삭제하면 되돌릴 수 없습니다. 해당 문서를 정말로 삭제하시겠습니까?</Mention>
          <CurrentDataText>
            {JSON.stringify(currentData, null, 4)}
          </CurrentDataText>
        </Body>
        <Footer>
          <FormBtn onClick={handleClose}>
            <p>취소</p>
          </FormBtn>
          <FormBtn className='delete' onClick={handleClickConfirm}>
            <p>삭제</p>
          </FormBtn>
        </Footer>
      </ModalContent>
    </Container>
  );
};

export default DeleteConfirmModal;

const Container = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  background-color: rgba(0, 0, 0, 0.5);
  
  pointer-events: ${({ isOpen }) => (isOpen ? 'all' : 'none')};
  z-index: 1000;

  transition: 150ms;
`
const ModalContent = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 90%;
  max-width: 38rem;
  max-height: 90%;
  padding: 1.25rem;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-1.25rem)')};

  background: var(--bg-documents);
  border: 1px solid var(--bg-modal-border);
  border-radius: 0.5rem;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.5);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  
  transition: ${({ isOpen }) => (isOpen ? '150ms' : '0')};
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.875rem;
  margin-bottom: 1.25rem;

  border-bottom: 1px solid var(--bg-modal-border);

  &>p {
    color: var(--color-mute-2);
    font-size: 1.125rem;
    font-weight: 500;
  }
`
const Body = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.5rem 1rem 0.5rem;

  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-thumb {
    height: 50%;
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 8px 8px 0 var(--bg-sb-mute);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 8px 8px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-documents);
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      box-shadow: inset 8px 8px 0 var(--bg-sb);
    }
  }
`
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`
const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  
  background: none;
  border: none;
  
  cursor: pointer;
  transition: 100ms;
  opacity: 0.5;

  &:hover {
    transform: scale(1.1);
    opacity: 1;
  }
`
const CloseIcon = styled(IconClose)`
  font-size: 1.3rem;
  transform: scale(1.4);
  color: var(--color-default);
`
const CloneIcon = styled(IconClone)`
  margin-right: 0.6rem;
  margin-bottom: 0.05rem;
  font-size: 1.25rem;
  color: var(--color-mute-2);
`
const FormBtn = styled.div`
  padding: 0.5em 1.25em;

  color: var(--color-default);
  font-size: 1rem;
  font-weight: 400;

  border: 1px solid #0000;
  border-radius: 0.5rem;
  
  cursor: pointer;

  transition: 100ms;
  
  &.delete {
    color: var(--color-default);
    font-weight: 400;
    background-color: var(--color-red-4);
  }
  
  &:hover {
    border: 1px solid var(--color-mute-2);
  }
`
const Mention = styled.div`
  color: var(--color-red-1);
  font-size: 0.875rem;
  font-weight: 300;
`
const CurrentDataText = styled.div`
  margin: 1.5rem 0;
  max-height: 8.25rem;
  overflow-y: auto;

  color: var(--color-mute-4);
  font-size: 0.875rem;
  font-weight: 300;
  white-space: pre-wrap;

  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-thumb {
    height: 50%;
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 8px 8px 0 var(--bg-sb-mute);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 8px 8px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-documents);
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      box-shadow: inset 8px 8px 0 var(--bg-sb);
    }
  }
`

