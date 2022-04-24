import React, {useEffect} from 'react';
import {Shown} from '@components/Shown';
import {useStores} from '@contexts';
import {observer} from 'mobx-react-lite';
import {useParams, useHistory} from 'react-router-dom';
import {BookList} from './BookList';

type BookParams = {
  bookId?: string;
};

export const BookContainer = observer(() => {
  const {UserStore} = useStores();
  const history = useHistory();
  const {bookId} = useParams<BookParams>();

  useEffect(() => {
    if (!UserStore.user) history.push('/login');
  }, [UserStore, history]);

  return (
    <Shown when={!bookId}>
      <BookList />
    </Shown>
  );
});
