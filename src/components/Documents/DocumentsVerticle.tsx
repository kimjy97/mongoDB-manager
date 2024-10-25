import { chekcedRowListState, originDocumentsState, queryAppliedState, refreshDocumentsState, responseDocumentsState } from '@/atoms/document';
import { currentCollectionState } from '@/atoms/selected';
import IconAdd from '@mui/icons-material/AddRounded';
import IconRefresh from '@mui/icons-material/RefreshRounded';
import LoadingPulse from '@components/Documents/LoadingPulse';
import { useApi } from '@/services/api';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import QueryInput from '@components/Documents/QueryInput';
import { isAddDocumentModalOpenState } from '@/atoms/modal';
import { objectToArray, preprocessQuery } from '@/utils/document';
import { useToast } from '@components/Toast/ToastContext';
import Document from '@components/Documents/Document';
import { useSearchParams } from 'next/navigation';

const DocumentsVerticle = (): JSX.Element => {
  const currentCollection = useRecoilValue(currentCollectionState);
  const [, setResponseDocuments] = useRecoilState(responseDocumentsState);
  const [documents, setDocuments] = useRecoilState(originDocumentsState);
  const [refresh, setRefresh] = useRecoilState(refreshDocumentsState);
  const [, setCheckedKey] = useRecoilState(chekcedRowListState);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useRecoilState(isAddDocumentModalOpenState);
  const [queryApplied, setQueryApplied] = useRecoilState(queryAppliedState);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();
  const { apiGet, apiPost } = useApi();
  const searchParams = useSearchParams();
  const database = searchParams.get('database');
  const collectionLabel = `${database ?? ''} > ${currentCollection?.alias || currentCollection?.name || '...'}`;

  const getDocumentsData = async (refresh?: boolean) => {
    if (refresh) {
      setDocuments([]);
      setResponseDocuments([]);
    }
    if ((loading || !hasMore || queryApplied) && !refresh) return;
    setLoading(true);
    setIsDataEmpty(false);
    try {
      const res = await apiGet(`/api/collections/${currentCollection.name}?page=${refresh ? 1 : page}&limit=${refresh ? page * 20 : 20}`);
      const newDocuments = res.documents.map((i: any) => objectToArray(i));
      setResponseDocuments((prev: any) => [...prev, ...res.documents]);
      setDocuments((prev: any) => [...prev, ...newDocuments]);
      refresh ?? setPage(prevPage => prevPage + 1);
      setHasMore(res.page < res.totalPages);
      setTotal(res.totalDocuments);
      newDocuments.length === 0 && setIsDataEmpty(true);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  const lastDocumentRef = useCallback((node: HTMLDivElement) => {
    if (loading || queryApplied) return;
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && page > 1) {
        setLoading(true);
        timeoutRef.current = setTimeout(() => {
          if (entry.isIntersecting) {
            getDocumentsData();
          }
        }, 1);
      } else {
        setLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }, { threshold: 1.0 });

    if (node && observer.current) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, queryApplied]);

  const handleInitState = () => {
    setCheckedKey([]);
    setDocuments([]);
    setResponseDocuments([]);
    setHasMore(true);
    setLoading(false);
    setPage(1);
  }

  const handleClickAddDocument = () => {
    setIsAddDocumentModalOpen(true);
  }

  const handleClickApply = async (queryInput: string, sortInput: string) => {
    if (queryInput === '' && sortInput === '') {
      return;
    }
    if (currentCollection) {
      let queryObject = '{}';
      let sortObject = '{}';
      try {
        queryObject = JSON.parse(preprocessQuery(queryInput));
        sortObject = JSON.parse(preprocessQuery(sortInput));
      } catch {
        showToast('쿼리 형식이 잘못 입력되었습니다.', 'error');
        return;
      }

      setLoading(true);
      setDocuments([]);
      setResponseDocuments([]);

      await apiPost(`/api/collections/${currentCollection.name}`, {
        query: queryObject,
        options: { sort: sortObject }
      })
        .then((res) => {
          const newDocuments = res.documents.map((i: any) => objectToArray(i));
          setResponseDocuments((prev: any) => [...prev, ...res.documents]);
          setDocuments((prev: any) => [...prev, ...newDocuments]);
          setQueryApplied(true);
          setHasMore(false);
          setTotal(res.documents.length);
        })
        .catch((error) => showToast(error.message, 'error'))
        .finally(() => setLoading(false));
    }
  }

  const handleClickRefresh = () => {
    setRefresh(true);
    setQueryApplied(false);
  }

  useEffect(() => {
    handleInitState();
  }, [currentCollection]);

  useEffect(() => {
    if (page === 1 && currentCollection) {
      getDocumentsData();
    }
  }, [page, currentCollection])

  useEffect(() => {
    if (refresh) {
      getDocumentsData(true);
      setRefresh(false);
    }
  }, [refresh])

  return (
    <Container>
      <Label>
        DOCUMENTS
        {(!loading && !isDataEmpty) && <Count>{documents.length} of <span>{total}</span></Count>}
      </Label>
      <CurrentCollection
        className={currentCollection ? 'visible' : ''}
      >
        {collectionLabel}
      </CurrentCollection>
      <OptionWrapper>
        <RefreshBtn onClick={handleClickRefresh}>
          <RefreshIcon />
        </RefreshBtn>
        <QueryInput handleClickApply={handleClickApply} />
        <AddDocumentBtn
          className={isAddDocumentModalOpen ? 'active' : ''}
          onClick={handleClickAddDocument}
        >
          <AddIcon />
          <p>새로운 문서</p>
        </AddDocumentBtn>
      </OptionWrapper>
      <DocumentListWrapper>
        {documents.map((doc: any, idx: number) =>
          <Document key={idx} data={doc} index={idx} />
        )}
        {(isDataEmpty) &&
          <EmptyData>
            <p>등록된 문서가 없습니다.</p>
            <AddDocumentBtn
              className={isAddDocumentModalOpen ? 'active' : ''}
              onClick={handleClickAddDocument}
            >
              <AddIcon />
              <p>새로운 문서</p>
            </AddDocumentBtn>
          </EmptyData>
        }
      </DocumentListWrapper>
      <LoadingPulse visible={page > 1 && loading} />
      {hasMore && <ObserverDiv ref={lastDocumentRef} />}
      {(!hasMore || queryApplied) && documents.length > 0 &&
        <EndMessage>
          <span>{documents.length}</span>
          <p>개의 문서를 모두 불러왔습니다.</p>
        </EndMessage>
      }
    </Container>
  )
};

export default DocumentsVerticle;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 3rem;
  padding-top: 2rem;
  padding-bottom: 20em;
`
const EndMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;

  background-color: var(--color-mute-8);
  border-bottom-left-radius: 0.875rem;
  border-bottom-right-radius: 0.875rem;
  border: 1px solid var(--bg-documents-border);
  border-top: none;

  color: var(--color-mute-6);
  font-size: 1rem;
  font-weight: 400;
`

const ObserverDiv = styled.div`
`
const Label = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  color: var(--color-default);
  font-size: 1.875rem;
  font-weight: 700;
`
const Count = styled.div`
  color: var(--color-mute-3);
  font-size: 0.875rem;
  font-weight: 400;

  &>span {
    color: var(--color-mute-3);
    font-size: 1.125rem;
    font-weight: 600;
  }
`
const DocumentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;

  border: 1px solid var(--bg-documents-border);
  border-bottom: none;
  border-top-left-radius: 0.875rem;
  border-top-right-radius: 0.875rem;
  background-color: var(--color-mute-8);
`
const AddDocumentBtn = styled.div`
  display: flex;
  gap: 0.375rem;
  align-items: center;
  padding: 0.5rem 0.8rem;
  padding-left: 0.55rem;
  margin-left: auto;

  border-radius: 0.5rem;
  outline: 1px solid var(--color-blue-5);

  color: var(--color-default);
  font-size: 0.875rem;
  font-weight: 300;
  white-space: nowrap;

  cursor: pointer;
  transition: 150ms;
  user-select: none;

  &.active {
    outline: 1px solid var(--color-mute-4);
  }

  &:hover {
    outline: 1px solid var(--color-mute-4);
  }
`
const AddIcon = styled(IconAdd)`
  color: var(--color-default);
  font-size: 1.25rem !important;
`
const RefreshBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1/1;

  cursor: pointer;
  will-change: transform;
  transition: 100ms;

  &:hover {
    transform: scale(1.1);

    svg {
      color: var(--color-mute-2);
    }
  }
`
const RefreshIcon = styled(IconRefresh)`
  margin-top: 0.125rem;
  color: var(--color-mute-5);
  font-size: 1.6rem !important;

  transition: 100ms;
`
const CurrentCollection = styled.div`
  min-height: 2rem;
  margin-bottom: 1rem;

  opacity: 0;

  color: var(--color-blue-1);
  font-size: 1rem;
  font-weight: 300;

  transition: 150ms;

  &.visible {
    opacity: 1;
  }
`
const EmptyData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  height: 400px;

  color: var(--color-mute-3);
  font-size: 1rem;
  font-weight: 300;

  border: 1px solid var(--bg-documents-border);
  border-bottom-left-radius: 0.875rem;
  border-bottom-right-radius: 0.875rem;

  &>div {
    margin-left: 0;
  }
`

