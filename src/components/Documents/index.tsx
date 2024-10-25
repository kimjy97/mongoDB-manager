import DocumentsVerticle from '@components/Documents/DocumentsVerticle';
import styled from 'styled-components';

const Documents = (): JSX.Element => {
  return (
    <Container>
      <DocumentsVerticle />
    </Container>
  )
};

export default Documents;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  min-width: 900px;
`