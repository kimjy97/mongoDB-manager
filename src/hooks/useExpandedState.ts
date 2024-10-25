import { useState } from 'react';

export interface ExpandedState {
  [key: string]: boolean | ExpandedState;
}

export const useExpandedState = () => {
  const [expandedState, setExpandedState] = useState<ExpandedState>({ root: false });

  const toggleExpanded = (path: string[]) => {
    setExpandedState((prevState) => {
      const newState = { ...prevState };
      let current: any = newState;
      if (path.length === 0) {
        current['root'] = !current['root'];
        return newState;
      }
      for (let i = 0; i < path.length; i++) {
        const key = path[i] || 'root';
        if (i === path.length - 1) {
          current[key] = !current[key];
        } else {
          if (typeof current[key] !== 'object') {
            current[key] = {};
          }
          current = current[key];
        }
      }
      return newState;
    });
  };

  const isExpanded = (path: string[]): boolean => {
    let current: any = expandedState;

    if (path.length === 0) return current['root'];

    for (const key of path) {
      const actualKey = key || 'root';
      if (typeof current !== 'object' || current[actualKey] === undefined) return false;
      current = current[actualKey];
    }
    return !!current;
  };

  return { expandedState, toggleExpanded, isExpanded };
};