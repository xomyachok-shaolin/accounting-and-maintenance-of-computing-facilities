import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { usersAtom } from "_state";
import { useUserActions } from "_actions";
import { Spin, Table, Tag } from "antd";
import { Space } from "antd";
import { Button } from "antd";

export { List };

function List({ match }) {
  const { path } = match;
  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();

  useEffect(() => {
    userActions.getAll();

    return userActions.resetUsers;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "Имя пользователя",
      dataIndex: "username",
      id: "username",
    },
    {
      title: "Адрес электронной почты",
      dataIndex: "mail",
      id: "mail",
    },
    {
      title: "Фамилия",
      dataIndex: "lastName",
      id: "lastName",
    },
    {
      title: "Имя",
      dataIndex: "firstName",
      id: "firstName",
    },
    {
      title: "Отчество",
      dataIndex: "patronymic",
      id: "patronymic",
    },
    {
        title: 'Роли',
        key: 'roles',
        dataIndex: 'roles',
        render: roles => (
          <>
            {roles.map(role => {
              let color = 'geekblue';
              if (role.name === 'Админситратор') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={role}>
                  {role.name.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: '',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
                <Link
                  to={`${path}/edit/${record.key}`}
                ><Button>
                  Редактировать
                  </Button>
                </Link>
                <Button
                  danger
                  onClick={() => userActions.delete(record.key)}
                  disabled={record.isDeleting}
                >
                  {record.isDeleting ? (
                    <Spin/>
                  ) : (
                    <span>Удалить</span>
                  )}
                </Button>
          </Space>
        ),
      },
  ];

  console.log(users)

  const data = users?.map(function (row) {
    return {
      key: row.id,
      username: row.username,
      lastName: row.lastName,
      firstName: row.firstName,
      patronymic: row.patronymic,
      mail: row.mail,
      roles: row.roles,
    };
  });
  console.log(data);
  return (
    <>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link to={`${path}/add`}>Добавить пользователя</Link>
      </Button>
      <Table columns={columns} dataSource={data}></Table>
      
    </>
  );
}
