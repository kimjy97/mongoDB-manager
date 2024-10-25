'use client';

import IconClose from '@mui/icons-material/CloseRounded';
import IconClone from '@mui/icons-material/FileCopyRounded';
import IconAdd from '@mui/icons-material/AddRounded';
import { isCopyModalOpenState } from '@/atoms/modal';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { IDocument, IRow, copyDocumentFormState } from '@/atoms/document';
import Row from '@components/Documents/Document/Row';
import { useHandleDocument } from '@/hooks/useHandleDocument';
import { currentCollectionState } from '@/atoms/selected';
import { useToast } from '@components/Toast/ToastContext';
import { getFormattingDocument } from '@/utils/document';

const CopyDocumentModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentCollection,] = useRecoilState(currentCollectionState);
  const [isModalOpen, setIsModalOpen] = useRecoilState(isCopyModalOpenState);
  const [currentData, setCurrentData] = useRecoilState(copyDocumentFormState);
  const [newRowIndex, setNewRowIndex] = useState<number | null>(null);
  const [newRowIndexText, setNewRowIndexText] = useState<number>(0);
  const { handleAddDocument } = useHandleDocument();
  const { showToast } = useToast();

  const isRowListOpen = isModalOpen ? 'open' : '';

  const handleClose = () => {
    setIsModalOpen(false);
  }

  const handleDocUpdate = (newArr: IDocument) => {
    setCurrentData(newArr);
  }

  const handleAddRow = () => {
    const newRow: IRow = { key: `key_${newRowIndexText}`, value: '' };
    setCurrentData([...currentData, newRow]);
    setNewRowIndex(currentData.length);
    setNewRowIndexText(prev => prev + 1);

    setTimeout(() => setNewRowIndex(null), 100);
  }

  const handleClickConfirm = async () => {
    await handleAddDocument(getFormattingDocument(currentData), currentCollection.name)
      .then(() => setIsModalOpen(false)).catch((error) => showToast(error.message, 'error'));
  }

  useEffect(() => {
    if (!isModalOpen) {
      setNewRowIndex(null);
      setNewRowIndexText(0);
      setCurrentData([]);
    }
  }, [isModalOpen])

  return (
    <Container isOpen={isModalOpen}>
      <ModalContent ref={modalRef} isOpen={isModalOpen}>
        <Header>
          <CloneIcon />
          <p>문서 복제</p>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Body>
          <RowList className={isRowListOpen}>
            {currentData && currentData.map((i: IRow, idx: number) =>
              <Row
                key={idx}
                docData={currentData}
                docChangedData={currentData}
                data={i}
                index={idx}
                handleDocUpdate={handleDocUpdate}
                isNewRow={idx === newRowIndex}
                clone
              />
            )}
          </RowList>
        </Body>
        <OptionWrapper>
          <OptionBtn onClick={handleAddRow}>
            <AddIcon />
          </OptionBtn>
        </OptionWrapper>
        <Footer>
          <FormBtn onClick={handleClose}>
            <p>취소</p>
          </FormBtn>
          <FormBtn className='save' onClick={handleClickConfirm}>
            <p>추가</p>
          </FormBtn>
        </Footer>
      </ModalContent>
    </Container>
  );
};

export default CopyDocumentModal;

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
  max-width: 50rem;
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
  
  &.save {
    color: var(--color-default);
    font-weight: 400;
    background-color: var(--color-blue-4);
  }
  
  &:hover {
    border: 1px solid var(--color-mute-2);
  }
`
const RowList = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  
  &>div:nth-child(-n+6) {
    position: relative;
    opacity: 1;
    pointer-events: auto;
  }

  &.open {
    & > div {
      position: relative;
      opacity: 1;
      pointer-events: auto;
    }
  }

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
const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.25rem;
  margin: 0.75rem 0;
  height: 2rem;
`
const AddIcon = styled(IconAdd)`
  font-size: 1.2rem;
  color: var(--color-default);
`
const OptionBtn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: 150ms;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0.3rem;

    border-radius: 100%;
    background-color: var(--color-mute-1);
    opacity: 0.05;

    transition: 150ms;
  }

  &:hover {
    transform: scale(1.1);

    &::before{
      opacity: 0.1;
    }
  }
`

function useRecoilValue(currentCollectionState: any) {
  throw new Error('Function not implemented.');
}

