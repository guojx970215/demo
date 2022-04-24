import React from 'react';
import {useStores} from '@contexts';
import {Button} from 'antd';
import {observer} from 'mobx-react-lite';
import styled from 'styled-components';

export const MenuTop = observer(() => {
  const {LangStore} = useStores();
  const trans = LangStore.trans;

  return (
    <StyledContainer>
      <div>menu</div>
      <StyledButton size="small" onClick={() => LangStore.toggleCurrent()}>
        {trans.currentLang}
      </StyledButton>
    </StyledContainer>
  );
});

const StyledContainer = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  height: 40px;
  background-color: var(--bg-color-white);
  border-bottom: 1px solid #fefefe;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
`;

const StyledButton = styled(Button)`
  margin-right: var(--spacing-2x);
`;
