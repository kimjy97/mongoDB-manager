import styled from 'styled-components';

interface IProps {
  visible: boolean;
};

const LoadingPulse = ({ visible }: IProps): JSX.Element => {
  return (
    <Container className={visible ? 'visible' : ''}>
      <div className="container">
        <div className="dot" />
      </div>
    </Container>
  )
};

export default LoadingPulse;

const Container = styled.div`
  position: absolute;
  display: none;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 7.5rem;
  left: 0;
  bottom: 5rem;

  opacity: 0.3;
  
  &.visible {
    display: flex;
  }

  .container {
    --uib-size: 43px;
    --uib-color: var(--color-blue-1);
    --uib-speed: 1.3s;
    --uib-dot-size: calc(var(--uib-size) * 0.24);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--uib-dot-size);
    width: var(--uib-size);
  }

  .dot,
  .container::before,
  .container::after {
    content: '';
    display: block;
    height: var(--uib-dot-size);
    width: var(--uib-dot-size);
    border-radius: 50%;
    background-color: var(--uib-color);
    transform: scale(0);
    transition: background-color 0.3s ease;
  }

  .container::before {
    animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.375)
      infinite;
  }

  .dot {
    animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.25)
      infinite both;
  }

  .container::after {
    animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.125)
      infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(0);
    }

    50% {
      transform: scale(1);
    }
  }
`
