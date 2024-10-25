'use client';

import IconClose from '@mui/icons-material/CloseRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import { isCreateCollectionModalOpenState } from '@/atoms/modal';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { useToast } from '@components/Toast/ToastContext';
import { useApi } from '@/services/api';
import { refreshDocumentsState } from '@/atoms/document';

const CreateCollectionModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useRecoilState(isCreateCollectionModalOpenState);
  const [, setRefresh] = useRecoilState(refreshDocumentsState);
  const [nameInput, setNameInput] = useState('');
  const { showToast } = useToast();
  const { apiPost } = useApi();

  const handleClose = () => {
    setIsModalOpen(false);
  }

  const handleClickConfirm = async () => {
    if (nameInput) {
      await apiPost('/api/collections/update', {
        collectionName: nameInput,
      }).then(res => {
        handleClose();
        setRefresh(true);
      }).catch(error => showToast('컬렉션을 추가하는데 실패했습니다.', 'error'));
    } else {
      showToast('추가할 컬렉션 이름을 입력해주세요.', 'error');
    }
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
      setNameInput('');
    }
  }, [isModalOpen])

  return (
    <Container isOpen={isModalOpen}>
      <ModalContent ref={modalRef} isOpen={isModalOpen}>
        <Header>
          <CollectionsIcon />
          <p>새로운 컬렉션</p>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Body>
          <Mention>추가할 컬레션 이름을 입력해주세요.</Mention>
          <Input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
          />
        </Body>
        <Footer>
          <FormBtn onClick={handleClose}>
            <p>취소</p>
          </FormBtn>
          <FormBtn className='main' onClick={handleClickConfirm}>
            <p>추가</p>
          </FormBtn>
        </Footer>
      </ModalContent>
    </Container>
  );
};

export default CreateCollectionModal;

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
const CollectionsIcon = styled(DescriptionIcon)`
  color: var(--color-mute-2);
  font-size: 1.5rem !important;
  margin-top: -0.125rem;
  margin-right: 0.6rem;
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
  
  &.main {
    color: var(--color-default);
    font-weight: 400;
    background-color: var(--color-blue-4);
  }
  
  &:hover {
    border: 1px solid var(--color-mute-2);
  }
`
const Mention = styled.div`
  margin-bottom: 1rem;

  color: var(--color-default);
  font-size: 0.875rem;
  font-weight: 300;
`
const Input = styled.input`
  padding: 0.75rem 1rem;
  margin-bottom: 0.875rem;

  background-color: transparent;
  border-radius: 0.5rem;
  border: 1px solid var(--color-mute-6);

  color: var(--color-default);
  font-size: 1rem;
  
  transition: 150ms;

  &:focus {
    border: 1px solid var(--color-blue-2);
  }
`

