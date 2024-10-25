import React, { useEffect } from 'react';
import Key from '@components/Documents/Document/Key';
import { getChangedKeyObject } from '@/utils/value';
import { CloseIcon, CollapsibleContainer, Dropdown, HeaderContainer, Item, ItemsContainer, MoreIcon, Slice } from '@components/Documents/styles';
import { TypeDropdown } from '@components/Documents/Document/TypeDropdown';
import { RecursiveValue } from '@components/Documents/Document/RecursiveValue';
import { ExpandedState } from '@/hooks/useExpandedState';
import { IRow } from '@/atoms/document';
import styled from 'styled-components';
import IconDelete from '@mui/icons-material/RemoveCircleOutline';
import IconAdd from '@mui/icons-material/AddRounded';
import IconUndo from '@mui/icons-material/UndoRounded';

type CollapsibleValueProps = {
  rowData: IRow;
  value: any;
  path: any[];
  onChange: (newValue: any) => void;
  valueType: string;
  handleTypeChange: (newType: string) => void;
  isExpanded: boolean;
  toggleExpanded: () => void;
  expandedState: ExpandedState;
  toggleExpandedState: (path: string[]) => void;
  isExpandedState: (path: string[]) => boolean;
  handleDelete: (path: any[]) => void;
  handleUndo: () => void;
  handleAdd: any;
  isNewData: any[] | null;
};

export const CollapsibleValue: React.FC<CollapsibleValueProps> = ({
  rowData,
  value,
  path,
  onChange,
  valueType,
  handleTypeChange,
  isExpanded,
  toggleExpanded,
  expandedState,
  toggleExpandedState,
  isExpandedState,
  handleDelete,
  handleUndo,
  handleAdd,
  isNewData,
}) => {
  const isArray = Array.isArray(value);
  const label = isArray ? `Array(${value.length})` : `Object(${Object.keys(value).length})`;
  const isDeletedClass = rowData.deleted ? 'deleted' : '';
  const isRootAndExpandedClass = `${path.length === 0 && isExpanded ? 'root' : ''} ${isDeletedClass}`;
  const dropdownClass = `${isExpanded ? 'open' : ''} ${isDeletedClass}`;

  const renderArrayItems = () =>
    value.map((item: IRow, i: number) => (
      <Item key={i} className={path.length > 0 ? 'indent' : ''}>
        <RecursiveValue
          rowData={rowData}
          value={item}
          parentType='array'
          path={[...path, i]}
          onChange={(newValue) => {
            const newArray = [...value];
            newArray[i] = newValue;
            onChange(newArray);
          }}
          expandedState={expandedState}
          toggleExpanded={toggleExpandedState}
          isExpanded={isExpandedState}
          handleDelete={handleDelete}
          handleUndo={handleUndo}
          handleAdd={handleAdd}
          isNewData={isNewData}
        />
      </Item>
    ));

  const renderObjectItems = () =>
    Object.entries(value).map(([key, val]) => (
      <Item key={key} className={path.length > 0 ? 'indent' : ''}>
        <Key
          data={{ key, value: val, deleted: rowData.deleted }}
          onChange={(newKey) => {
            onChange(getChangedKeyObject(newKey, key, value));
          }}
          isEditing={JSON.stringify(isNewData) === JSON.stringify([rowData.key, ...path])}
        />
        <Slice className={isDeletedClass}>:</Slice>
        <RecursiveValue
          rowData={rowData}
          value={val}
          parentType='object'
          path={[...path, key]}
          onChange={(newValue) => {
            onChange({ ...value, [key]: newValue });
          }}
          expandedState={expandedState}
          toggleExpanded={toggleExpandedState}
          isExpanded={isExpandedState}
          handleDelete={handleDelete}
          handleUndo={handleUndo}
          handleAdd={handleAdd}
          isNewData={isNewData}
        />
      </Item>
    ));

  const handleClickAdd = () => {
    handleAdd([rowData.key, ...path], valueType);
    if (!isExpanded) {
      toggleExpanded();
    }
  }

  return (
    <CollapsibleContainer className={isRootAndExpandedClass}>
      <HeaderContainer>
        <Dropdown className={dropdownClass} onClick={toggleExpanded}>
          {label}
          {isExpanded ? <CloseIcon /> : <MoreIcon />}
        </Dropdown>
        <OptionWrapper>
          {!rowData.deleted &&
            <OptionBtn id='optionDeleteBtn' onClick={handleClickAdd}>
              <AddIcon />
            </OptionBtn>
          }
          {rowData.deleted ?
            <OptionBtn className='undo' id='optionDeleteBtn' onClick={handleUndo}>
              <UndoIcon />
            </OptionBtn>
            :
            <OptionBtn id='optionDeleteBtn' onClick={() => handleDelete(path)}>
              <DeleteIcon />
            </OptionBtn>
          }
        </OptionWrapper>
        {!rowData.deleted && <TypeDropdown value={valueType} onChange={handleTypeChange} />}
      </HeaderContainer>
      {isExpanded && (
        <ItemsContainer id='itemContainer'>
          {isArray ? renderArrayItems() : renderObjectItems()}
        </ItemsContainer>
      )}
    </CollapsibleContainer>
  );
};

const DeleteIcon = styled(IconDelete)`
  opacity: 0.4;
  
  color: var(--color-red-2);
  font-size: 1.125em !important;
`
const AddIcon = styled(IconAdd)`
  opacity: 0.4;

  color: var(--color-default);
  font-size: 1.125em !important;

  will-change: transform;
  transition: 150ms;
`
const UndoIcon = styled(IconUndo)`
  opacity: 0.4;

  color: var(--color-blue-2);
  font-size: 1.125em !important;

  will-change: transform;
  transition: 150ms;
`
const OptionWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 100%;
`
const OptionBtn = styled.div`
  align-self: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  opacity: 0;
  cursor: pointer;

  &.undo {
    opacity: 1;

    &:hover::before {
      opacity: 0.14;
    }
  }

  &:hover svg {
    opacity: 1 !important;
    transform: scale(1.08);
    will-change: transform;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.5em 0.5em;
    background-color: var(--color-blue-1);
    opacity: 0;
    border-radius: 100%;
    transition: 150ms;
  }
`