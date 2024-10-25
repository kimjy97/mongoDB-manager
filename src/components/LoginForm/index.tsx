import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import IconLink from '@mui/icons-material/Launch';
import { useRecoilState } from 'recoil';
import { apiKeyState } from '@/atoms/global';
import { useApi } from '@/services/api';
import DatabaseList from '@components/LoginForm/DatabaseList';
import DatabaseListLoading from '@components/LoginForm/DatabaseListLoading';
import { useToast } from '@components/Toast/ToastContext';
import { currentCollectionState } from '@/atoms/selected';

const LoginForm = (): JSX.Element => {
  const [, setApiKey] = useRecoilState(apiKeyState);
  const [, setCurrentCollection] = useRecoilState(currentCollectionState);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>('');
  const [autoAuthChecked, setAutoAuthChecked] = useState<boolean>(false);
  const [databaseList, setDatabaseList] = useState<any[] | undefined>(undefined);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState<boolean>(false);
  const [isErrInput, setIsErrInput] = useState<boolean>(false);
  const { apiGet } = useApi();
  const { showToast } = useToast();
  const inputClassName = `${isFocus ? 'focus' : ''} ${keyInput !== '' ? 'fill' : ''} ${isErrInput ? 'error' : ''}`

  const handleClickConnect = async (key?: string) => {
    if (!isDatabaseLoading) {
      setIsDatabaseLoading(true);
      await apiGet('/api/database', {
        headers: {
          'X-API-Key': key || keyInput
        }
      }).then((res) => {
        setDatabaseList(res);
        setApiKey(key || keyInput);
      }).catch((error) => {
        showToast('입력하신 MongoDB URI가 유효하지 않습니다.', 'error');
        setIsErrInput(true);
      }).finally(() => setIsDatabaseLoading(false))
    }
  }

  const handleClickCheckBox = () => {
    setAutoAuthChecked(!autoAuthChecked);
    if (!autoAuthChecked) localStorage.setItem('apiKey', keyInput)
    else localStorage.removeItem('apiKey');
  }

  const handleChangeInput = (e: any) => {
    setKeyInput(e.target.value);
    setIsErrInput(false);
  }

  useEffect(() => {
    const key = localStorage.getItem('apiKey');
    setKeyInput(key ?? '');
    if (key) {
      handleClickConnect(key);
      setAutoAuthChecked(true);
    }
    setCurrentCollection(undefined);
  }, [])

  return (
    <Container>
      <Title>
        <h1>MongoDB 접속하기</h1>
        <a href='https://cloud.mongodb.com' target='_blank'>몽고DB 바로가기 <LinkIcon /></a>
      </Title>
      {/* <Note>MongoDB와 연결하기 위해 API Key를 입력해주세요.</Note> */}
      <FormWrapper>
        <InputWrapper
          className={inputClassName}
          onClick={() => setIsFocus(true)}
        >
          <InputLabel>MongoDB URI</InputLabel>
          <Input
            value={keyInput}
            placeholder='mongodb+srv://'
            onChange={handleChangeInput}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </InputWrapper>
      </FormWrapper>
      <DatabaseList data={databaseList} />
      <AutoAuth
        className={databaseList ? 'visible' : ''}
        onClick={(e) => {
          handleClickCheckBox(); e.preventDefault();
        }}
      >
        <p>자동으로 접속</p>
        <CheckBox
          id='check'
          type='checkbox'
          checked={autoAuthChecked}
          onChange={() => handleClickCheckBox()}
        />
        <label htmlFor="check" />
      </AutoAuth>
      <BtnWrapper>
        <FormBtn
          className={isDatabaseLoading ? 'loading' : ''}
          onClick={() => handleClickConnect()}
        >
          <p>URI 연결하기</p>
          <DatabaseListLoading />
        </FormBtn>
      </BtnWrapper>
    </Container>
  )
};

export default LoginForm;

const errorAni = keyframes`
  25% {
    transform: translateX(-0.1875rem);
  }
  50% {
    transform: translateX(0rem);
  }
  75% {
    transform: translateX(0.1875rem);
  }
  100% {
    transform: translateX(0);
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 37.5rem;
  max-height: calc(100vh - 6.25rem);
  padding: 1.5rem;

  border-radius: 0.875rem;
  border: 1.5px solid var(--bg-documents-border);
  background-color: var(--color-mute-8);
  box-shadow: 0 0 60px rgba(0, 0 , 0, 0.1);
`
const Title = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;

  h1 {
    color: var(--color-default);
    font-size: 1.625rem;
    font-weight: 700;
  }

  &>a {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--color-mute-5);
    font-size: 0.875rem;
    font-weight: 300;

    &:hover {
      text-decoration: underline;
    }
  }
`
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 3.5rem;

  background-color: transparent;
  outline: 1px solid var(--bg-documents-border);
  border-radius: 0.625rem;

  transition: 150ms;
  cursor: text;

  &.focus {
    outline: 1px solid var(--color-blue-2);
    height: 4.25rem;
    &>p {
      top: 1rem;
      left: 0rem;
      transform: translateY(-50%) scale(0.7);

      color: var(--color-blue-3);
    }
  }

  &.fill {
    height: 4.25rem;
    &>p {
      top: 1rem;
      left: 0rem;
      transform: translateY(-50%) scale(0.7);
    }
  }

  &.error {
    outline: 1px solid var(--color-red-2);
    animation: ${errorAni} 150ms 3 linear;
  }
`
const Input = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 1rem;
  padding-top: 1.1rem;

  color: var(--color-default);
  font-size: 1rem;
  font-weight: 300;

  &::placeholder {
    color: var(--color-mute-6);
    opacity: 0;
    transition: 150ms;
  }

  &:focus::placeholder {
    opacity: 1;
  }
`
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  margin-bottom: 1.25rem;
  height: 4.375rem;
`
const InputLabel = styled.p`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);

  color: var(--color-mute-5);
  font-size: 1rem;
  font-weight: 400;

  pointer-events: none;
  transition: 150ms;
`
const Note = styled.p`
  padding-left: 0.25rem;

  color: var(--color-yellow-5);
  font-size: 0.875rem;
  font-weight: 300;
`
const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`
const FormBtn = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 0;

  border-radius: 0.5rem;
  background-color: var(--color-blue-3);
  
  color: var(--color-default);
  font-size: 1rem;
  font-weight: 500;

  cursor: pointer;
  user-select: none;
  transition: 150ms;

  &>div:last-child {
    display: none;
  }

  &.loading {
    display: flex;
    color: var(--color-mute-4);
    background-color: var(--color-mute-7);
  }

  &:hover {
    filter: brightness(120%);
  }
`
const AutoAuth = styled.div`
  align-self: flex-end;
  display: none;
  align-items: center;
  gap: 0.625rem;
  margin-right: 0.5rem;

  color: var(--color-mute-3);
  font-size: 0.875rem;
  font-weight: 300;
  
  cursor: pointer;
  user-select: none;

  &>p {
    transition: 50ms;
  }

  &.visible {
    display: flex;
  }

  &:hover {
    color: var(--color-mute-2);

    label{
      border: 1.5px solid var(--color-blue-2);
      transform: scale(1.05);
    }
  }
`
const CheckBox = styled.input`
  display: none;
  
  &+label {
    position: relative;
    display: inline-block;
    width: 1.125rem;
    height: 1.125rem;
    
    border: 1.5px solid var(--color-blue-3);
    border-radius: 100%;
    background: var(--color-mute-8);
    
    cursor: pointer;
    transform: 150ms;

    &::after {
      content:'';
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      left: 50%;
      top:50%;
      transform: translate(-50%, -50%);

      background-color: transparent;
      border-radius: 100%;
      transition: 100ms;
    }
  }

  &:checked + label::after{
    background-color: var(--color-blue-2);
  }
`
const LinkIcon = styled(IconLink)`
  color: var(--color-mute-5);
  font-size: 1rem !important;
`