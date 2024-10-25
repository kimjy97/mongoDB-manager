import styled from 'styled-components';
import IconMore from '@mui/icons-material/KeyboardArrowDownRounded';

export const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
`
export const StyledPrimitiveValue = styled.div`
  flex: 1;
  min-width: 1.5em;
  color: var(--color-mute-2);
  font-size: 1em;
  font-weight: 400;
  line-height: 1.25em;
  white-space: pre-wrap;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  cursor: text;

  &.numeric {
    color: var(--color-yellow-5);
  }

  &.date {
    color: var(--color-default);
  }

  &.deleted {
    text-decoration: line-through;
    color: var(--color-red-4);
  }

  &.expanded {
    -webkit-line-clamp: unset;
    overflow: visible;
  }
`
export const Textarea = styled.textarea<{ isValid: boolean }>`
  position: relative;
  flex: 1;
  color: var(--color-default);
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
    outline: 1.5px solid ${props => props.isValid ? 'var(--color-blue-3)' : 'var(--color-red-3)'};
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
export const CollapsibleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75em;

  &.root {
    padding-bottom: 0.25em;
  }

  &.deleted {
    #optionBtn {
      display: none;
    }
  }
`
export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`
export const Item = styled.div`
  display: flex;
  position: relative;
  margin-left: 1.2em;

  &::before {
    content: '';
    position: absolute;
    top: 0.625em;
    left: -0.92em;
    width: 0.15rem;
    height: 0.15rem;
    background-color: var(--color-mute-6);
  }

  &:not(:has(#itemContainer)):hover {
    #optionBtn {
      opacity: 1;
    }
  }
`
export const Dropdown = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-blue-3);
  line-height: 1.25em;
  cursor: pointer;

  &.open {
    text-decoration: underline;
  }

  &.deleted {
    color: var(--color-red-4);
    text-decoration: line-through;

    &>svg {
      color: var(--color-red-4);
    }

    &:hover {
      text-decoration: line-through underline;
    }
  }

  &:hover {
    text-decoration: underline;
  }
`
export const MoreIcon = styled(IconMore)`
  height: 100%;

  color: var(--color-blue-4);
  font-size: 1.2em !important;
`
export const CloseIcon = styled(IconMore)`
  height: 100%;

  font-size: 1.2em !important;
  color: var(--color-blue-4);
  
  transform: rotate(180deg);
`
export const Slice = styled.div`
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
export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  gap: 1.5em;

  & select {
    opacity: 0.5;
  }

  &:hover {
    & select {
      opacity: 1;
    }
  }
`
export const Select = styled.select`
  margin-left: auto;
  align-self: flex-start;
  background-color: transparent;
  outline: none;
  border: none;
  border-radius: 0.2em;
  color: var(--color-mute-3);
  font-size: 0.9em;
  line-height: 1.125em;
  text-align: right;
  cursor: pointer;

  &.deleted {
    opacity: 0 !important;
    pointer-events: none;
  }

  &:hover {
    text-decoration: underline;
  }
`

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75em;

  & select {
    opacity: 0.5;
  }

  &:hover {
    & select {
      opacity: 1;
    }
    & #optionDeleteBtn {
      opacity: 1;
    }
  }
`
export const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
`
export const ExpandButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--color-blue-3);
  cursor: pointer;
  font-size: 0.9em;
  padding: 0.2em 0;
  margin-top: 0.2em;

  &:hover {
    text-decoration: underline;
  }
`
export const ErrorMsg = styled.div`
  position: absolute;
  top: -3.5em;
  padding: 0.75em 1em;
  transform: translateX(-0.5em) translateY(0.625em);

  border-radius: 0.75em;
  background-color: var(--color-reverse);
  border: 1px solid var(--color-red-6);
  opacity: 0;

  color: var(--color-red-2);
  font-size: 0.75em;
  font-weight: 400;

  transition: 150ms;

  &.visible {
    opacity: 1;
    transform: translateX(-0.5em) translateY(0);
  }
`