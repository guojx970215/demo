import React, {createContext, FC, useContext, ReactNode} from 'react';
import {RootStore} from '@stores';

export const StoresContext = createContext<RootStore>(new RootStore());

export const useStores = () => useContext(StoresContext);

type StoresProviderProps = {
  children?: ReactNode;
};

export const StoresWrapper: FC<StoresProviderProps> = (props: StoresProviderProps) => {
  const {children} = props;

  return <StoresContext.Provider value={new RootStore()}>{children}</StoresContext.Provider>;
};
