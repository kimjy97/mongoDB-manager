import React, { useEffect, useRef } from 'react';
import {
  InputWrapper,
  ValueContainer,
  StyledPrimitiveValue,
  Textarea,
  ExpandButton,
  ErrorMsg
} from '@components/Documents/styles';
import { TypeDropdown } from '@components/Documents/Document/TypeDropdown';
import { usePrimitiveValue } from '@/hooks/usePrimitiveValue';
import styled from 'styled-components';
import IconDelete from '@mui/icons-material/RemoveCircleOutline';
import IconUndo from '@mui/icons-material/UndoRounded';
import { IRow } from '@/atoms/document';

interface PrimitiveValueProps {
  rowData: IRow;
  value: any;
  path: any[];
  onChange: (newValue: any) => void;
  type: string;
  onTypeChange: (newType: string) => void;
  handleDelete: any;
  handleUndo: any;
  isNewData: any;
  parentType?: 'object' | 'array';
}

export const PrimitiveValue: React.FC<PrimitiveValueProps> = ({
  rowData,
  value,
  path,
  onChange,
  type,
  onTypeChange,
  handleDelete,
  handleUndo,
  isNewData,
  parentType,
}) => {
  const {
    isVisibleErrorMsgClassName,
    isEditing,
    editValue,
    isValid,
    hasOverflow,
    isExpanded,
    valueRef,
    textareaRef,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
    handleInputChange,
    toggleExpand,
    formattedValue
  } = usePrimitiveValue(value, type, onChange);

  const inputWrapperRef = useRef<any>(null);
  const className = `${type === 'number' ? 'numeric' : ''} ${isExpanded ? 'expanded' : ''} ${rowData.deleted ? 'deleted' : ''}`;

  const checkIfLastChild = (ref: any) => {
    let isLast = false;
    if (ref.current) {
      const parent = ref.current.parentElement;
      if (parent) {
        isLast = ref.current === parent.lastElementChild;
      }
    }

    return isLast;
  };

  useEffect(() => {
    if (
      JSON.stringify(isNewData) === JSON.stringify([rowData.key, ...path]) &&
      parentType !== 'object' &&
      checkIfLastChild(inputWrapperRef)
    ) {
      handleDoubleClick();
    }
  }, [isNewData])

  if (isEditing) {
    return (
      <InputWrapper>
        <Textarea
          ref={textareaRef}
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          isValid={isValid}
          rows={1}
        />
        <ErrorMsg className={isVisibleErrorMsgClassName}>
          설정된 데이터 타입과 일치하지 않습니다.
        </ErrorMsg>
        <TypeDropdown value={type} onChange={onTypeChange} />
      </InputWrapper>
    );
  }

  return (
    <InputWrapper ref={inputWrapperRef}>
      <ValueContainer>
        <StyledPrimitiveValue
          ref={valueRef}
          className={className}
          onDoubleClick={() => !rowData.deleted && handleDoubleClick()}
        >
          {formattedValue}
        </StyledPrimitiveValue>
        {(hasOverflow) && (
          <ExpandButton onClick={() => toggleExpand()}>
            {isExpanded ? 'Show less' : 'Show more'}
          </ExpandButton>
        )}
      </ValueContainer>
      {rowData.deleted ?
        <OptionBtn className='undo' id='optionBtn' onClick={handleUndo}>
          <UndoIcon />
        </OptionBtn>
        :
        <OptionBtn id='optionBtn' onClick={handleDelete}>
          <DeleteIcon />
        </OptionBtn>
      }
      <TypeDropdown className={rowData.deleted ? 'deleted' : ''} value={type} onChange={onTypeChange} />
    </InputWrapper>
  );
};

const DeleteIcon = styled(IconDelete)`
  opacity: 0.4;
  color: var(--color-red-2);
  font-size: 1.125em !important;
`
const UndoIcon = styled(IconUndo)`
  opacity: 0.4;

  color: var(--color-blue-2);
  font-size: 1.125em !important;
  
  will-change: transform;
  transition: 150ms;
`
const OptionBtn = styled.div`
  align-self: flex-start;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.25em;

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
    border-radius: 100%;
    background-color: var(--color-blue-1);
    opacity: 0;
    transition: 150ms;
  }
`