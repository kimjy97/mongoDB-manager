import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import IconApplied from '@mui/icons-material/CheckRounded';
import IconApply from '@mui/icons-material/DoneOutlineRounded';
import { currentCollectionState } from '@/atoms/selected';
import { useRecoilState, useRecoilValue } from 'recoil';
import { responseDocumentsState, originDocumentsState, queryAppliedState, refreshDocumentsState } from '@/atoms/document';

interface IProps {
  handleClickApply: (queryInput: string, sortInput: string) => void;
}

const QueryInput = ({ handleClickApply }: IProps): JSX.Element => {
  const filterInputRef = useRef<any>(null);
  const sortInputRef = useRef<any>(null);
  const currentCollection = useRecoilValue(currentCollectionState);
  const [queryApplied, setQueryApplied] = useRecoilState(queryAppliedState);
  const [refresh, setRefresh] = useRecoilState(refreshDocumentsState);
  const [isFilterFocus, setIsFilterFocus] = useState<boolean>(false);
  const [isSortFocus, setIsSortFocus] = useState<boolean>(false);
  const [queryInput, setQueryInput] = useState<string>('');
  const [sortInput, setSortInput] = useState<string>('');

  const handleKeyUpInput = (e: any) => {
    if (e.key === 'Enter') {
      handleClickApply(queryInput, sortInput);
    }
  }

  useEffect(() => {
    setQueryApplied(false);
  }, [currentCollection])

  useEffect(() => {
    setQueryApplied(false);
  }, [refresh])

  return (
    <Container>
      <Wrapper
        className={isFilterFocus ? 'focus' : ''}
        onClick={() => filterInputRef.current.focus()}
      >
        <QueryInputLabel>
          Query
        </QueryInputLabel>
        <Input
          value={queryInput}
          ref={filterInputRef}
          placeholder='{ field: "value" }'
          onChange={e => setQueryInput(e.target.value)}
          onFocus={() => setIsFilterFocus(true)}
          onBlur={() => setIsFilterFocus(false)}
          onKeyUp={handleKeyUpInput}
        />
      </Wrapper>
      <Wrapper
        className={isSortFocus ? 'focus' : ''}
        onClick={() => sortInputRef.current.focus()}
      >
        <QueryInputLabel>
          Sort
        </QueryInputLabel>
        <Input
          value={sortInput}
          ref={sortInputRef}
          placeholder='{ field: -1 }'
          onChange={e => setSortInput(e.target.value)}
          onFocus={() => setIsSortFocus(true)}
          onBlur={() => setIsSortFocus(false)}
          onKeyUp={handleKeyUpInput}
        />
      </Wrapper>
      <ApplyBtn
        id='applyBtn'
        className={queryApplied ? 'applied' : ''}
        onClick={() => handleClickApply(queryInput, sortInput)}
      >
        {queryApplied ?
          <AppliedIcon />
          :
          <ApplyIcon />
        }
      </ApplyBtn>
    </Container>
  )
};

export default QueryInput;

const Container = styled.div`
  display: flex;
  gap: 1em;
  height: 100%;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 16rem;
  height: 100%;
  padding-left: 1rem;
  padding-right: 0.25rem;

  border-radius: 0.5rem;
  outline: 1px solid var(--color-blue-5);
  background-color: var(--color-mute-8);

  transition: 100ms;
  cursor: text;

  &.focus {
    outline: 1px solid var(--color-blue-2);

    &>p {
      color: var(--color-mute-2)
    }

    #applyBtn svg{
      color: var(--color-mute-4);
    }
  }
`
const QueryInputLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-mute-4);

  user-select: none;
  transition: 100ms;
`
const Input = styled.input`
  flex: 1;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.0938rem;
  color: var(--color-yellow-1);
`
const ApplyBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1/1;

  cursor: pointer;
  will-change: transform;
  transition: 150ms;

  &:hover {
    transform: scale(1.1);
    &:not(.applied) svg{
      color: var(--color-blue-3) !important;
    }
  }
`
const ApplyIcon = styled(IconApply)`
  position: absolute;
  color: var(--color-blue-4);
  font-size: 1.3em !important;

  transition: 150ms;
`
const AppliedIcon = styled(IconApplied)`
  position: absolute;
  color: var(--color-yellow-4) !important;
  font-size: 1.3rem;

  transition: 150ms;
`