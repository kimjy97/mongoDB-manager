import { IRow } from '@/atoms/document';
import { CollapsibleValue } from '@components/Documents/Document/CollapsibleValue';
import { PrimitiveValue } from '@components/Documents/Document/PrimitiveValue';
import { InputWrapper } from '@components/Documents/styles';
import { useToast } from '@components/Toast/ToastContext';
import { ExpandedState } from '@/hooks/useExpandedState';
import { useValueType } from '@/hooks/useValueType';
import { convertValue, getValueType } from '@/utils/valueUtils';
import React, { useEffect } from 'react';

interface RecursiveValueProps {
  rowData: IRow;
  value: any;
  parentType?: 'object' | 'array';
  path: string[];
  onChange: (newValue: any) => void;
  expandedState: ExpandedState;
  toggleExpanded: (path: string[]) => void;
  isExpanded: (path: string[]) => boolean;
  handleDelete: any;
  handleUndo: any;
  handleAdd: any;
  isNewData: any[] | null;
}

export const RecursiveValue: React.FC<RecursiveValueProps> = ({
  rowData,
  value,
  parentType,
  path,
  onChange,
  expandedState,
  toggleExpanded,
  isExpanded,
  handleDelete,
  handleUndo,
  handleAdd,
  isNewData,
}) => {
  const { valueType, setValueType } = useValueType(value);
  const { showToast } = useToast();

  const handleTypeChange = (newType: string) => {
    try {
      const convertedValue = convertValue(value, valueType, newType);
      setValueType(newType);
      onChange(convertedValue);
    } catch {
      showToast('데이터 타입을 변경할 수 없습니다.', 'error');
    }
  };

  useEffect(() => {
    setValueType(getValueType(value));
  }, [rowData])

  if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Date))) {
    return (
      <CollapsibleValue
        rowData={rowData}
        value={value}
        path={path}
        onChange={onChange}
        valueType={valueType}
        handleTypeChange={handleTypeChange}
        isExpanded={isExpanded(path)}
        toggleExpanded={() => toggleExpanded(path)}
        expandedState={expandedState}
        toggleExpandedState={toggleExpanded}
        isExpandedState={isExpanded}
        handleDelete={handleDelete}
        handleUndo={handleUndo}
        handleAdd={handleAdd}
        isNewData={isNewData}
      />
    );
  } else {
    return (
      <InputWrapper>
        <PrimitiveValue
          rowData={rowData}
          value={value}
          path={path.slice(0, -1)}
          onChange={onChange}
          type={valueType}
          onTypeChange={handleTypeChange}
          handleDelete={() => handleDelete(path)}
          handleUndo={handleUndo}
          isNewData={isNewData}
          parentType={parentType}
        />
      </InputWrapper>
    );
  }
};