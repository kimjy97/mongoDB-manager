import styled from 'styled-components';
import IconDelete from '@mui/icons-material/DeleteForever';
import IconAdd from '@mui/icons-material/AddRounded';
import IconClone from '@mui/icons-material/FileCopyRounded';
import IconMore from '@mui/icons-material/ExpandMore';
import IconLess from '@mui/icons-material/ExpandLess';
import IconWarning from '@mui/icons-material/WarningRounded';
import { IDocument, IRow } from '@/atoms/document';
import { isCopyModalOpenState } from '@/atoms/modal';
import { useRecoilState } from 'recoil';
import { useHandleDocument } from '@/hooks/useHandleDocument';

interface IProps {
  handleAddRow: any;
  handleClickClone: any;
  handleClickDelete: any;
}

const DocumentOption = ({ handleAddRow, handleClickClone, handleClickDelete }: IProps): JSX.Element => {

  return (
    <Container>
      <ControlBtn onClick={handleAddRow}>
        <AddIcon />
      </ControlBtn>
      <ControlBtn onClick={handleClickClone}>
        <CloneIcon />
      </ControlBtn>
      <ControlBtn onClick={handleClickDelete}>
        <DeleteIcon />
      </ControlBtn>
    </Container>
  )
};

export default DocumentOption;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 2.875em;
  height: 100%;
  top: 0;
  right: 0;
  padding: 0.5em 0;

  background-color: var(--color-mute-8);

  transition: 150ms;
  z-index: 2;
`
const ControlBtn = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 0.5rem);
  aspect-ratio: 1/1;

  cursor: pointer;

  &:last-child {
    margin-top: auto;
  }

  &:hover {
    & > svg {
      opacity: 1;
      transform: scale(1.1);
    }
  }
`
const DeleteIcon = styled(IconDelete)`
  font-size: 1.6em !important;
  color: var(--color-red-2);

  opacity: 0.7;

  will-change: transform;
  transition: 150ms;
`
const AddIcon = styled(IconAdd)`
  font-size: 1.8em !important;
  color: var(--color-default);

  opacity: 0.5;

  will-change: transform;
  transition: 150ms;
`
const CloneIcon = styled(IconClone)`
  font-size: 1.15em !important;
  color: var(--color-default);

  opacity: 0.5;

  will-change: transform;
  transition: 150ms;
`