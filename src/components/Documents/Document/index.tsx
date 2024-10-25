import { IDocument, IRow, copyDocumentFormState, deleteDocumentFormState, responseDocumentsState } from '@/atoms/document';
import { isCopyModalOpenState, isDeleteConfirmModalOpenState } from '@/atoms/modal';
import { currentCollectionState } from '@/atoms/selected';
import DocumentOption from '@components/Documents/Document/DocumentOption';
import EditSelectBtn from '@components/Documents/Document/EditSelectBtn';
import Row from '@components/Documents/Document/Row';
import RowMoreBtn from '@components/Documents/Document/RowMoreBtn';
import { useHandleDocument } from '@/hooks/useHandleDocument';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled, { keyframes } from 'styled-components';

interface IProps {
  data: IDocument,
  index: number
};

const Document = ({ data, index }: IProps): JSX.Element => {
  const [, setIsDeleteConfirmModalOpen] = useRecoilState(isDeleteConfirmModalOpenState);
  const [, setIsCopyModalOpen] = useRecoilState(isCopyModalOpenState);
  const [, setCopyDocumentForm] = useRecoilState(copyDocumentFormState);
  const [deleteDocumentForm, setDeleteDocumentForm] = useRecoilState(deleteDocumentFormState);
  const [responseDocuments,] = useRecoilState(responseDocumentsState);
  const [currentCollection,] = useRecoilState(currentCollectionState);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [changedData, setChangedData] = useState<IDocument>(data);
  const [reset, setReset] = useState<boolean>(false);
  const [newRowIndex, setNewRowIndex] = useState<number | null>(null);
  const [newRowIndexText, setNewRowIndexText] = useState<number>(0);
  const { handleModifyDocument } = useHandleDocument()

  const isEditModeClassName = isEditMode ? 'edit' : '';
  const isDeleteModeClassName = JSON.stringify(deleteDocumentForm) === JSON.stringify(responseDocuments[index]) ? 'delete' : '';
  const isRowListOpen = isOpen ? 'open' : '';
  const isBottomVisibleClassName = (data.length > 5 || isEditMode) ? 'visible' : '';

  const handleDocUpdate = (newArr: IDocument) => {
    setChangedData(newArr);
  }

  const handleResetData = () => {
    setChangedData(data);
    setReset(true);
    setIsEditMode(false);
    setNewRowIndexText(0);
  }

  const handleAddRow = () => {
    const newRow: IRow = { key: `key_${newRowIndexText}`, value: '' };
    setChangedData([...changedData, newRow]);
    setIsOpen(true);
    setNewRowIndex(changedData.length);
    setNewRowIndexText(prev => prev + 1);

    setTimeout(() => setNewRowIndex(null), 100);
  }

  const handleClickClone = () => {
    setCopyDocumentForm([...data.filter((i: any) => i.key != '_id')]);
    setIsCopyModalOpen(true);
  }

  const handleClickDelete = () => {
    setDeleteDocumentForm(responseDocuments[index]);
    setIsDeleteConfirmModalOpen(true);
  }

  const handleClickModify = () => {
    handleModifyDocument(currentCollection.name, responseDocuments[index], changedData)
  }

  useEffect(() => {
    const isDataChanged = JSON.stringify(data) !== JSON.stringify(changedData);
    setIsEditMode(isDataChanged);
  }, [changedData])

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset])

  return (
    <Container className={`${isEditModeClassName} ${isDeleteModeClassName}`}>
      <LeftLayout>
        <RowList className={`${isRowListOpen} ${isBottomVisibleClassName}`}>
          <LeftBackground />
          {changedData.map((i: IRow, idx: number) =>
            <Row
              key={idx}
              docData={data}
              docChangedData={changedData}
              data={i}
              index={idx}
              handleDocUpdate={handleDocUpdate}
              reset={reset}
              isNewRow={idx === newRowIndex}
            />
          )}
        </RowList>
        <BottomLayout className={isBottomVisibleClassName} >
          <RowMoreBtn data={data} isOpen={isOpen} setIsOpen={setIsOpen} />
          {isEditMode && <EditSelectBtn handleResetData={handleResetData} handleClickModify={handleClickModify} />}
        </BottomLayout>
      </LeftLayout>
      <DocumentOption
        handleAddRow={handleAddRow}
        handleClickClone={handleClickClone}
        handleClickDelete={handleClickDelete}
      />
    </Container>
  )
};

export default Document;

const FadeIn = keyframes`
  100% {
    opacity: 1;
  }
`
const Container = styled.div`
  position: relative;
  display: flex;

  min-height: 10.8369em;

  background-color: var(--bg-documents);
  border: 1px solid var(--bg-documents-border);
  border-bottom: none;
  opacity: 0;

  font-size: 0.875rem;

  animation: ${FadeIn} 250ms forwards;
  overflow: hidden;

  &.edit {
    outline: 1.5px solid var(--bg-documents-edit-border);
    z-index: 2;
  }

  &.delete {
    outline: 1.5px solid var(--color-red-3);
    z-index: 2;
  }

  &:last-child {
    border-bottom: 1px solid var(--bg-documents-border);
  }
`
const LeftLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const BottomLayout = styled.div`
  display: none;
  align-items: center;
  gap: 0.25em;
  height: 3.5em;
  padding-left: 2.8em;
  padding-right: 1.5em;

  &.visible {
    display: flex;
  }
`
const RowList = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.125em 0;
  
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

  &.visible {
    padding-bottom: 0;
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
const LeftBackground = styled.p`
  position: absolute;
  width: 2.6em;
  height: 100%;
  top: 0;

  opacity: 0.4;
`