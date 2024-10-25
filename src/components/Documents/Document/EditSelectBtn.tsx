import { useState } from 'react';
import styled from 'styled-components';
import IconWarning from '@mui/icons-material/WarningRounded';

interface IProps {
  handleResetData: () => void;
  handleClickModify: () => void;
};

const EditSelectBtn = ({ handleResetData, handleClickModify }: IProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<{ message: string, type: 'warning' | 'error' } | undefined>(undefined);
  const [totalChanges, setTotalChanges] = useState<number>(0);

  return (
    <Container>
      {errorMessage &&
        <ErrorNote>
          {errorMessage.type === 'error' && <WarningIcon />}
          <p>{errorMessage.message}</p>
        </ErrorNote>
      }
      <FormBtn onClick={handleResetData}>
        <p>취소</p>
      </FormBtn>
      <FormBtn className='save' onClick={handleClickModify}>
        <p>적용</p>
      </FormBtn>
      <ChangeNote>{totalChanges} changed</ChangeNote>
    </Container>
  )
};

export default EditSelectBtn;

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5em;
  margin-left: auto;
`
const FormBtn = styled.div`
  padding: 0.875em 1.5em;

  color: var(--color-mute-2);
  font-size: 0.875em;
  font-weight: 400;

  border: 1px solid #0000;
  border-radius: 0.7em;
  
  cursor: pointer;
  
  &.save {
    color: var(--color-yellow-2);
    font-weight: 400;
  }
  
  &:hover {
    border: 1px solid var(--color-mute-6);
  }
`
const ChangeNote = styled.div`
  margin-left: 1em;
  padding: 0.375em 0.6em;

  border-radius: 1em;
  border: 1px solid var(--color-mute-6);

  color: var(--color-mute-4);
  font-size: 0.75em;
`
const ErrorNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-right: 2em;

  color: var(--color-red-2);
  font-size: 0.75em;
`
const WarningIcon = styled(IconWarning)`
  font-size: 1.125em;
  color: var(--color-red-2);
`