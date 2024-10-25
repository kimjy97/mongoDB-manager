import { IDocument } from '@/atoms/document';
import styled from 'styled-components';
import IconMore from '@mui/icons-material/ExpandMore';
import IconLess from '@mui/icons-material/ExpandLess';

interface IProps {
  data: IDocument;
  isOpen: boolean;
  setIsOpen: any;
};

const RowMoreBtn = ({ data, isOpen, setIsOpen }: IProps): JSX.Element | null => {
  return data.length > 5 ? (
    <Container onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? <LessIcon /> : <MoreIcon />}
      {isOpen ? <p>접기</p> : <p>{data.length - 5}개 속성 더보기...</p>}
    </Container>
  ) : null
};

export default RowMoreBtn;

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.25em;
  height: 100%;

  font-size: 1em;
  font-weight: 450;
  
  cursor: pointer;
  * { color: var(--color-blue-3); }

  &:hover *{
    color: var(--color-blue-2);
    transition: 100ms;
  }
`
const MoreIcon = styled(IconMore)`
  font-size: 1.25em !important;
  color: var(--color-mute-5);

  opacity: 1;
`
const LessIcon = styled(IconLess)`
  font-size: 1.125em !important;
  color: var(--color-mute-5);

  opacity: 1;
`