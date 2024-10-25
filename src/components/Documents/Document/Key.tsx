import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IRow } from '@/atoms/document';

interface IProps {
  data: IRow;
  onChange: (newKey: string) => void;
  isEditing?: boolean;
}

const Key: React.FC<IProps> = ({ data, onChange, isEditing = false }) => {
  const [isEditingMode, setIsEditingMode] = useState(isEditing);
  const [editValue, setEditValue] = useState(data.key);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenKeyRef = useRef<any>(null);
  const keyNameClassName = data.deleted ? 'deleted' : '';

  const getFontSize = (element: HTMLElement): number => {
    return parseFloat(getComputedStyle(element).fontSize);
  };

  const adjustInputWidth = (pRef: React.RefObject<HTMLElement>, inputRef: React.RefObject<HTMLElement>, emOffset: number) => {
    if (pRef.current && inputRef.current) {
      const fontSize = getFontSize(inputRef.current);
      const widthInPx = pRef.current.offsetWidth;
      const widthInEm = widthInPx / fontSize;
      inputRef.current.style.width = `${Math.min(widthInEm + emOffset, 30)}em`;
    }
  };

  const handleDoubleClick = () => {
    setIsEditingMode(true);
  };

  const handleBlur = () => {
    setIsEditingMode(false);
    if (editValue === '') setEditValue(data.key);
    else if (data.key !== editValue) onChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const handleChange = (e: any) => {
    setEditValue(e.target.value);
  }

  useEffect(() => {
    if (isEditingMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingMode]);

  useEffect(() => {
    if (isEditingMode) {
      adjustInputWidth(hiddenKeyRef, inputRef, 0);
    }
  }, [editValue, isEditingMode]);

  return (
    <Container>
      {isEditingMode ? (
        <Input
          ref={inputRef}
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <OriginKeyName
          className={keyNameClassName}
          onDoubleClick={() => !data.deleted && handleDoubleClick()}
        >
          {data.key}
        </OriginKeyName>
      )}
      <HiddenKeyName ref={hiddenKeyRef}>
        {editValue}
      </HiddenKeyName>
    </Container>
  );
};

export default Key;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
`
const OriginKeyName = styled.div`
  color: var(--color-yellow-4);
  font-size: 1em;
  font-weight: 400;
  line-height: 1.25em;
  cursor: text;

  &.deleted {
    text-decoration: line-through;
    color: var(--color-red-4);
  }
`
const HiddenKeyName = styled(OriginKeyName)`
  position: absolute;

  opacity: 0;
  pointer-events: none;
`
const Input = styled.input`
  color: var(--color-mute-2);
  font-size: 1em;
  line-height: 1.25em;
  
  border-radius: 0.2em;
  outline-offset: 0.25em;
  outline: 1.5px solid #fff0;
  
  resize: none;
  overflow: hidden;
  transition: outline 150ms;
  
  &.modified {
    color: var(--color-yellow-2);
  }

  &:focus {
    outline: 1.5px solid var(--color-blue-3);
  }

  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-thumb {
    height: 50%;
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 8px 8px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 8px 8px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-documents);
  }
`