import React, {ReactNode} from 'react';

type ShownProps = {
  when: boolean;
  children?: ReactNode;
};

export const Shown = (props: ShownProps) => {
  const {when, children} = props;

  return when ? <>{children}</> : null;
};
