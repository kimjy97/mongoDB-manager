import { useState, useRef, useEffect } from 'react';
import { formatEditValue, formatValue, parseValue } from '../utils/valueUtils';
import { validateInput } from '@/utils/value';

export const usePrimitiveValue = (value: any, type: string, onChange: (newValue: any) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const valueRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!hasOverflow) {
      checkOverflow();
    }
  }, [value, type]);

  const checkOverflow = () => {
    if (valueRef.current) {
      const hasOverflow = valueRef.current.scrollHeight > valueRef.current.clientHeight;
      setHasOverflow(hasOverflow);
    }
  };

  const getFontSize = (element: HTMLElement): number => {
    return parseFloat(getComputedStyle(element).fontSize);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(formatEditValue(value, type));
    setIsValid(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (isValid) {
      let newValue: any = parseValue(editValue, type);
      if (JSON.stringify(value) !== JSON.stringify(newValue)) {
        setIsExpanded(false);
        onChange(newValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    setIsValid(validateInput(newValue, type));
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const fontSize = getFontSize(textareaRef.current);
      textareaRef.current.style.height = 'auto';
      const scrollHeightInEm = (textareaRef.current.scrollHeight - 0.5) / fontSize;
      textareaRef.current.style.height = `${scrollHeightInEm}em`;
    }
  };

  const toggleExpand = (bool?: boolean) => {
    if (bool === undefined) setIsExpanded(!isExpanded);
    else setIsExpanded(bool);
  };

  useEffect(() => {
    if (textareaRef.current && isEditing) {
      textareaRef.current.select();
      adjustTextareaHeight();
    }
  }, [isEditing]);

  const formattedValue = formatValue(value, type);

  const isVisibleErrorMsgClassName = isValid ? '' : 'visible';

  return {
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
  };
};