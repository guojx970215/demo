import React, {useEffect} from 'react';
import {BookOutlined} from '@ant-design/icons';
import {useStores} from '@contexts';
import {Modal, List, Avatar, Input, Button} from 'antd';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';

export const BookList = observer(() => {
  const {BookListStore} = useStores();
  const history = useHistory();

  useEffect(() => {
    BookListStore.init();

    return () => {
      BookListStore.clear();
    };
  }, [BookListStore]);

  const onSearch = async (page: string) => {
    BookListStore.setSearchKey(page);
    await BookListStore.fetchBookListByPage(1);
  };

  return (
    <Modal title="My project list" visible={true} footer={null} width={740}>
      <StyledBar>
        <Input.Search placeholder="input search text" onSearch={onSearch} allowClear />
        <Button type="primary">Add Project</Button>
      </StyledBar>
      <StyledContainer>
        <List
          loading={BookListStore.isLoading}
          itemLayout="horizontal"
          pagination={{
            onChange: (page) => BookListStore.fetchBookListByPage(page),
            total: BookListStore.total,
            pageSize: BookListStore.pageSize,
          }}
          dataSource={BookListStore.data}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <a key="list-loadmore-edit">delete</a>,
                <a key="list-loadmore-copy">copy</a>,
                <a key="list-loadmore-editName">edit name</a>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<BookOutlined />} />}
                title={<a onClick={() => history.push('/book/' + item.id)}>{item.bookName}</a>}
              />
              <div>{item.createTime}</div>
            </List.Item>
          )}
        />
      </StyledContainer>
    </Modal>
  );
});

const StyledBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2x);

  .ant-input-search {
    width: 300px;
  }
`;

const StyledContainer = styled.div`
  .ant-list-item-meta {
    align-items: center;

    .ant-list-item-meta-title {
      margin-bottom: 0;
    }
  }
`;
