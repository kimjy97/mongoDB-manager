'use client'

import { useApi } from '@/services/api';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import IconDelete from '@mui/icons-material/DeleteForeverRounded';
import IconExit from '@mui/icons-material/LogoutRounded';
import IconDatabase from '@mui/icons-material/StorageRounded';
import IconAdd from '@mui/icons-material/AddRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import { useRecoilState } from 'recoil';
import { currentCollectionState } from '@/atoms/selected';
import { deleteDocumentFormState, refreshDocumentsState } from '@/atoms/document';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { isCreateCollectionModalOpenState, isDeleteCollectionModalOpenState } from '@/atoms/modal';

const Collections = (): JSX.Element => {
  const [currentCollection, setCurrentCollection] = useRecoilState(currentCollectionState);
  const [refresh, setRefresh] = useRecoilState(refreshDocumentsState);
  const [, setIsDeleteModalOpen] = useRecoilState(isDeleteCollectionModalOpenState);
  const [isCreateModalOpen, setIsCreateModalOpen] = useRecoilState(isCreateCollectionModalOpenState);
  const [, setCurrentData] = useRecoilState(deleteDocumentFormState);
  const [collections, setCollections] = useState<string[] | undefined>(undefined);
  const { apiGet } = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const database = searchParams.get('database');

  const getCollectionsData = async () => {
    await apiGet('/api/collections').then((res) => {
      setCollections(res.collections);
    })
  }

  const handleClickItem = (i: any) => {
    setCurrentCollection(i);
  }

  const handleClickExit = () => {
    router.push('/auth');
  }

  const handleClickDelete = (e: any, i: any) => {
    setIsDeleteModalOpen(true);
    setCurrentData(i)
    e.stopPropagation();
  }

  const handleClickCreate = () => {
    setIsCreateModalOpen(true);
  }

  useEffect(() => {
    getCollectionsData();
  }, []);

  useEffect(() => {
    if (refresh) {
      getCollectionsData();
    }
  }, [refresh])

  useEffect(() => {
    if (!currentCollection && collections) {
      handleClickItem(collections[0]);
    }
    if (collections && !collections?.includes(currentCollection)) {
      handleClickItem(collections[0]);
    }
  }, [collections, currentCollection, pathname])

  return (
    <Container>
      <Label>
        <CollectionsIcon />
        <p>COLLECTIONS</p>
        <ExitBtn onClick={handleClickExit}>
          <ExitIcon />
        </ExitBtn>
      </Label>
      <Info>
        <DatabaseIcon />
        <p>{database}</p>
      </Info>
      <CreateCollectionBtn
        className={isCreateModalOpen ? 'active' : ''}
        onClick={handleClickCreate}
      >
        <AddIcon />
        <p>새로운 컬렉션</p>
      </CreateCollectionBtn>
      <List>
        {collections && collections.map((i: any, idx: number) =>
          <CollectionItem
            className={currentCollection?.name === i.name ? 'active' : ''}
            key={idx}
            onClick={() => handleClickItem(i)}
          >
            <p>
              {i.alias}
              <span>{i.documentCount}</span>
            </p>
            <DeleteBtn onClick={e => handleClickDelete(e, i)}>
              <DeleteIcon />
            </DeleteBtn>
          </CollectionItem>
        )}
      </List>
    </Container>
  )
};

export default Collections;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  width: 17.5rem;
  height: 100vh;
  top: 0;

  background-color: var(--bg-collections);
  border-right: 1px solid var(--bg-collections-border);
`
const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0.875rem;

  color: var(--color-blue-1);
  font-size: 1.125rem;
  font-weight: 600;

  &>span {
    color: var(--color-mute-4);
    font-size: 1rem;
    font-weight: 400;
  }
`
const List = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 0;

  overflow: auto;

  &::-webkit-scrollbar {
    width: 14px; /* 스크롤바의 너비 */
  }
  &::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 6px 6px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 6px 6px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-collections);
  }
`
const CollectionItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  padding-right: 1rem;

  color: var(--color-default);
  font-size: 0.875rem;
  font-weight: 450;

  cursor: pointer;

  &>p:nth-child(1) {
    flex: 1;

    &>span {
      color: var(--color-mute-4);
      margin-left: 0.625rem;
    } 
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    background-color: var(--color-blue-1);
    opacity: 0;
    z-index: -1;
  }

  &.active span {
    color: var(--color-mute-3) !important;
  }

  &.active::before {
    opacity: 0.4;
    background-color: var(--color-blue-5);
    
    transition: opacity 100ms ease-out;
  }

  &:not(.active):hover::before {
    opacity: 0.03;
  }

  &:hover {
    svg {
      opacity: 0.35;
    }
  }
`
const DeleteBtn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: 150ms;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.75rem;
  }

  &:hover {
    transform: scale(1.1);

    svg {
      opacity: 0.6;
    }
  }
`
const DeleteIcon = styled(IconDelete)`
  opacity: 0;

  color: var(--color-red-2);
  font-size: 1.125rem !important;
  
  will-change: transform;
  transform: scale(1.15);
  transition: 150ms;

  &.active {
    opacity: 1;
  }
`
const CollectionsIcon = styled(DescriptionIcon)`
  color: var(--color-blue-1);
  font-size: 1.25rem !important;
  margin-top: -0.125rem;
`
const ExitBtn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1/1;
  margin-left: auto;

  cursor: pointer;
  transition: 150ms;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0.35rem;

    border-radius: 100%;
    background-color: var(--color-mute-7);
    opacity: 0;

    z-index: -1;
    will-change: transform;
    transition: 150ms;
  }

  &:hover {
    transform: scale(1.1);

    &::before {
      opacity: 1;
    }

    &>svg {
      color: var(--color-mute-2);
    }
  }
`
const ExitIcon = styled(IconExit)`
  margin-left: 0.25rem;

  color: var(--color-mute-5);
  font-size: 1.4rem !important;

  transition: 150ms;
`
const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1.5rem 1rem;
  padding-right: 0.625rem;
  padding-top: 0rem;

  &>p {
    padding-right: 1rem;

    color: var(--color-yellow-4);
    font-size: 1rem;
    text-overflow: ellipsis;

    overflow: hidden;
  }
`
const DatabaseIcon = styled(IconDatabase)`
  color: var(--color-yellow-4);
  font-size: 1.125rem !important;
`
const CreateCollectionBtn = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.7rem;
  margin: 1.125rem 0.75rem;
  margin-top: 0;
  border-radius: 0.5rem;
  outline: 1px solid var(--color-mute-6);

  color: var(--color-default);
  font-size: 0.75rem;
  font-weight: 400;
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
  font-size: 1.125rem !important;
`