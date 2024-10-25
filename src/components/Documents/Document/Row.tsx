import { IDocument, IRow, chekcedRowListState } from '@/atoms/document';
import Key from '@components/Documents/Document/Key';
import Value from '@components/Documents/Document/Value';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

interface IProps {
  docData: IDocument;
  docChangedData: IDocument;
  data: IRow;
  index: number;
  reset?: boolean;
  handleDocUpdate: (newArr: IDocument) => void;
  isNewRow?: boolean;
  clone?: boolean;
};

const Row = ({ docData, docChangedData, data, index, reset, handleDocUpdate, isNewRow = false, clone }: IProps): JSX.Element => {
  const [chekcedRowList, setChekcedRowList] = useRecoilState(chekcedRowListState);
  const [changed, setChanged] = useState<IRow>(docData[index]);
  const [isNewData, setIsNewData] = useState<any[] | null>(null);

  const isCheckedClassName = chekcedRowList?.includes(data.key) ? 'active' : '';
  const editBarClassName = (docData[index] !== changed && !data.deleted) ? 'visible' : '';
  const isDeletedClassName = data.deleted ? 'deleted' : '';
  const isCloneClassName = clone ? 'clone' : '';

  const handleClickCheck = (str: string) => {
    let result = [...chekcedRowList];
    if (chekcedRowList.includes(str)) {
      result = chekcedRowList.filter((i: any) => i !== str);
    } else {
      result.push(str);
    }

    setChekcedRowList([...result]);
  }

  const handleKeyUpdate = (newKey: any) => {
    const newArr = [...docChangedData];
    newArr[index] = { ...data, key: newKey }

    handleDocUpdate(newArr);
    setChanged(newArr[index]);
  }

  const handleValueUpdate = (newValue: any) => {
    const newArr = [...docChangedData];
    newArr[index] = { ...data, value: newValue }

    handleDocUpdate(newArr);
    setChanged(newArr[index]);
  };

  const handleRemoveKeyValuePair = (pairToRemove: { key: string, value: any }) => {
    const newArr = [...docChangedData].map(item =>
      item.key === pairToRemove.key && item.value === pairToRemove.value
        ? { ...item, deleted: true }
        : item
    );

    handleDocUpdate(newArr);
  };

  const handleRemoveArrayElement = (path: any[]) => {
    const updateDocChangedData = (data: IDocument, path: (string | number)[]): IDocument => {
      const cloneData = JSON.parse(JSON.stringify(data));
      let current: any = cloneData;
      let parent: any = null;
      let lastKey: string | number | undefined;

      for (let i = 0; i < path.length; i++) {
        const key = path[i];

        if (typeof key === 'string') {
          if (Array.isArray(current)) {
            const foundIndex = current.findIndex((item: { key: string }) => item.key === key);
            if (foundIndex !== -1) {
              parent = current;
              current = current[foundIndex]?.value;
              lastKey = foundIndex;
            } else {
              return cloneData;
            }
          } else if (typeof current === 'object') {
            parent = current;
            current = current[key];
            lastKey = key;
          }
        } else if (typeof key === 'number') {
          if (Array.isArray(current) && current[key] !== undefined) {
            parent = current;
            current = current[key];
            lastKey = key;
          } else {
            return cloneData;
          }
        }

        if (current === undefined) return cloneData;
      }

      if (parent && lastKey !== undefined) {
        if (Array.isArray(parent) && typeof lastKey === 'number') {
          parent.splice(lastKey, 1);
        } else if (typeof parent === 'object' && typeof lastKey === 'string') {
          delete parent[lastKey];
        }
      }

      return cloneData;
    };
    const newArr = updateDocChangedData([...docChangedData], path)
    setChanged(newArr[index]);
    handleDocUpdate(newArr);
  };

  const handleUndoDelete = (pairToRemove: { key: string, value: any, deleted: boolean }) => {
    const newArr = [...docChangedData].map(item =>
      item.key === pairToRemove.key && item.value === pairToRemove.value
        ? { key: item.key, value: item.value }
        : item
    );

    handleDocUpdate(newArr);
    setChanged(docData[index]);
  }

  const handleAddElement = (path: any[], type: 'object' | 'array') => {
    const data = [...docChangedData];
    const modifyValue = (value: any, remainingPath: (string | number)[]): any => {
      if (remainingPath.length === 0) {
        if (type === 'array') {
          return Array.isArray(value) ? [...value, ""] : value;
        } else if (type === 'object') {
          if (typeof value === 'object' && value !== null) {
            const keys = Object.keys(value).filter(k => k.startsWith('key_'));
            const nextKeyNumber = keys.length > 0
              ? Math.max(...keys.map(k => parseInt(k.split('_')[1]))) + 1
              : 0;
            return { ...value, [`key_${nextKeyNumber}`]: "" };
          }
          return value;
        }
        return value;
      }

      const [current, ...rest] = remainingPath;

      if (Array.isArray(value)) {
        return value.map((item, index) =>
          index === current ? modifyValue(item, rest) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        return {
          ...value,
          [current]: modifyValue(value[current], rest)
        };
      }

      return value;
    };

    const newArr = data.map(item => {
      if (item.key === path[0]) {
        return {
          ...item,
          value: modifyValue(item.value, path.slice(1))
        };
      }
      return item;
    });

    handleDocUpdate(newArr);
    setChanged(newArr[index]);
    setIsNewData(path);
  }

  useEffect(() => {
    if (reset) {
      setChanged(docData[index]);
    }
  }, [reset])

  useEffect(() => {
    if (isNewData) {
      setIsNewData(null);
    }
  }, [isNewData])

  useEffect(() => {
    if (isNewRow) {
      setChanged(docChangedData[index]);
    }
  }, [isNewRow])

  return (
    <Container className={`${isCheckedClassName} ${isCloneClassName}`}>
      <CheckBtn className={`${isCheckedClassName} ${isCloneClassName}`} id='check' onClick={() => handleClickCheck(data.key)} />
      <EditBar className={`${editBarClassName} ${!data.key ? 'error' : ''} ${isCloneClassName}`} />
      <Key data={data} onChange={handleKeyUpdate} isEditing={isNewRow} />
      <Slice className={isDeletedClassName}>:</Slice>
      <Value
        data={data}
        onUpdate={handleValueUpdate}
        onDeletePair={handleRemoveKeyValuePair}
        onDeleteElements={handleRemoveArrayElement}
        onUndoDelete={handleUndoDelete}
        onAddElement={handleAddElement}
        isNewData={isNewData}
      />
    </Container>
  )
};

interface AddRowProps {
  onAddRow: () => void;
}

export default Row;

const Container = styled.div`
  position: absolute;
  display: flex;
  padding: 0.4em;
  padding-left: 3em;
  padding-right: 1em;

  opacity: 0;
  pointer-events: none;

  & > * {
    z-index: 1;
  }

  &.clone {
    padding-left: 1.25em;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    background-color: var(--color-reverse);
    opacity: 0;

    z-index: 0;
  }

  &.active::before {
    background-color: var(--color-blue-1) !important;
    opacity: 0.045 !important;
  }

  &:not(.active):hover {
    #check {
      opacity: 0.5;
    }
    
    &::before {
      opacity: 0.5 !important;
      background-color: var(--color-reverse) !important;
    }
  }

  &:not(:has(#itemContainer)):hover {
    #optionBtn {
      opacity: 1;
    }
  }
`
const CheckBtn = styled.div`
  position: absolute;
  width: 2.6em;
  height: 2.05em;
  top: 0;
  left: 0;

  opacity: 0;

  cursor: pointer;
  transition: transform 150ms, background-color 150ms;

  &::after {
    content: '';
    position: absolute;
    width: 0.5em;
    height: 0.5em;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    background-color: var(--color-red-5);
    border-radius: 100%;
  }

  &.active {
    opacity: 1 !important;

    &::after {
      background-color: var(--color-red-2) !important;
    }
  }

  &.clone {
    display: none;
  }

  &:hover {
    transform: scale(1.3);
    &::after {
      background-color: var(--color-red-3);
    }
  }
`
const Slice = styled.div`
  padding-left: 0.3em;
  padding-right: 0.6em;
  color: var(--color-default);
  font-size: 0.875em;
  font-weight: 400;
  line-height: 1.25em;

  &.deleted {
    color: var(--color-red-4);
  }
`
const EditBar = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0em;
  left: 0em;

  pointer-events: none;
  
  &.visible {
    background-color: var(--color-yellow-2);
    opacity: 0.05;
  }

  &.error {
    background-color: var(--color-red-2);
    opacity: 0.1;
  }

  &.clone {
    display: none;
  }
`