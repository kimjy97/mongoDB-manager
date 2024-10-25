import React from 'react';
import { IRow } from '@/atoms/document';
import { useExpandedState } from '@/hooks/useExpandedState';
import { Container } from '@components/Documents/styles';
import { RecursiveValue } from '@components/Documents/Document/RecursiveValue';

interface IProps {
  data: IRow;
  onUpdate: (newValue: any) => void;
  onDeletePair: any;
  onDeleteElements: any;
  onUndoDelete: any;
  onAddElement: any;
  isNewData: any[] | null;
}

const Value: React.FC<IProps> = ({ data, onUpdate, onDeletePair, onDeleteElements, onUndoDelete, onAddElement, isNewData }) => {
  const { expandedState, toggleExpanded, isExpanded } = useExpandedState();

  const handleDelete = (path: any[]) => {
    if (path.length === 0) {
      onDeletePair(data);
    } else {
      onDeleteElements([data.key, ...path]);
    }
  }

  const handleUndo = () => {
    onUndoDelete(data);
  }

  return (
    <Container>
      <RecursiveValue
        rowData={data}
        value={data.value}
        path={[]}
        onChange={(newValue) => onUpdate(newValue)}
        expandedState={expandedState}
        toggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
        handleDelete={handleDelete}
        handleUndo={handleUndo}
        handleAdd={onAddElement}
        isNewData={isNewData}
      />
    </Container>
  );
};

export default Value;