import React, { ReactNode,useState,useContext,useCallback,useEffect,useMemo,useLayoutEffect,useRef,useReducer } from 'react';

type FormProps = {
    children?: ReactNode;
    form?: Object
};

type FormLabelProps = {
    children?: ReactNode;
    errorTip?: String
};

type FormUploadProps = {
    children?: ReactNode;
};

type FormContextProviderProps = {
    
}

const FormContext = React.createContext({});

export const Form = (props: FormProps) => {
    const [form,setForm] = useState()
    return (
      <FormContext.Provider value={{form,setForm}}>
        <div>1</div>
      </FormContext.Provider>
    )
}

export const FormLabel = (props: FormLabelProps) => {
    const { errorTip } = props
    const hasErrorTipClass = errorTip ? 'information-item topline inputting item-error' : 'information-item topline inputting'
    return (
      <div className={hasErrorTipClass}>
          
      </div>
    )
}

export const FormUpload = (props: FormUploadProps) => {
    return (
      <div>
          
      </div>
    )
}