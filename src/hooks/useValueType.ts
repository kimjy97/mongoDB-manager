import { getValueType } from '@/utils/valueUtils';
import { useState } from 'react';

export const useValueType = (initialValue: any) => {
  const [valueType, setValueType] = useState(getValueType(initialValue));

  return { valueType, setValueType };
};