import styled from 'styled-components';
import IconArrow from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';

interface IProps {
  data: any[] | undefined;
};

const DatabaseList = ({ data }: IProps): JSX.Element | null => {
  const router = useRouter();

  const handleClickItem = (i: any) => {
    localStorage.setItem('database', i.name);
    router.push(`/documents?database=${i.name}`);
  }

  return data ? (
    <Container>
      <Label>
        <p>DATABASE</p>
        <p>{data.length - 2}개의 데이터베이스가 검색되었습니다.</p>
      </Label>
      <Wrapper>
        {data.slice(0, -2).map((i: any, idx: number) =>
          <DatabaseItem key={idx} onClick={() => handleClickItem(i)}>
            <p>{i.name}</p>
            <ArrowIcon />
          </DatabaseItem>
        )}
      </Wrapper>
    </Container>
  ) : null
};

export default DatabaseList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.125rem;
  margin-top: 0.625rem;
`
const DatabaseItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  
  border-bottom: 1px solid var(--bg-documents-border);

  color: var(--color-yellow-5);
  font-size: 1rem;
  font-weight: 300;

  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--color-reverse);
  }
`
const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.625rem;
  padding: 0 0.25rem;

  &>p:first-child {
    color: var(--color-mute-4);
    font-size: 0.875rem;
    font-weight: 500;
  }

  &>p:last-child {
    color: var(--color-mute-5);
    font-size: 0.75rem;
    font-weight: 300;
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 18.75rem;

  border-radius: 0.625rem;
  border: 1px solid var(--bg-documents-border);

  overflow: auto;
`
const ArrowIcon = styled(IconArrow)`
  color: var(--color-mute-6);
  font-size: 1rem !important;
`