import { Select } from '@components/Documents/styles';
import React from 'react';

interface TypeDropdownProps {
  className?: string;
  value: string;
  onChange: (newType: string) => void;
}

export const TypeDropdown: React.FC<TypeDropdownProps> = ({ className, value, onChange }) => {
  return (
    <Select className={className ?? ''} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="string">string</option>
      <option value="number">number</option>
      <option value="boolean">boolean</option>
      <option value="date">date</option>
      <option value="array">array</option>
      <option value="object">object</option>
      <option value="null">null</option>
    </Select>
  );
};