import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";

import { usersAtom, userAtom, imageAtom } from "_state";
import { useUserActions, useAlertActions } from "_actions";
import { Form, Modal, Spin, Table, Tag, Input, Image } from "antd";
import { Space } from "antd";
import { Button } from "antd";
import { Avatar } from "account/Avatar";

export { List };

function List({ match }) {
  const [form] = Form.useForm();

  const { path } = match;
  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();
  const alertActions = useAlertActions();

  const [loading, setLoading] = useState(false);

  const user = useRecoilValue(userAtom);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [mode, setMode] = useState(false);

  const [image,setImage] = useRecoilState(imageAtom);

  useEffect(() => {
    userActions.getAll();

    return userActions.resetUsers;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // fetch user details into recoil state in edit mode
    if (mode) {
      userActions.getById(mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: '',
      dataIndex: "imageFile",
      render:  () => <img src="imageFile" />
    },
    {
      title: "Имя пользователя",
      dataIndex: "username",
      id: "username",
    },
    {
      title: "Электронная почта",
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
      title: "Роли",
      key: "roles",
      dataIndex: "roles",
      render: (roles) => (
        <>
          {roles.map((role) => {
            let color = "geekblue";
            if (role.name === "Администратор") {
              color = "volcano";
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
      title: "",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showEditModal(record.key)}>
            Редактировать
          </Button>
          <Button
            danger
            onClick={() => userActions.delete(record.key)}
            disabled={record.isDeleting}
          >
            {record.isDeleting ? <Spin /> : <span>Удалить</span>}
          </Button>
        </Space>
      ),
    },
  ];

  console.log(users);

  const data = users?.map(function (row) {
    return {
      key: row.id,
      username: row.username,
      lastName: row.lastName,
      firstName: row.firstName,
      patronymic: row.patronymic,
      mail: row.mail,
      roles: row.roles,
      imageFile: row.imageFile
    };
  });

  const showModal = () => {
    setVisible(true);
  };

  const showAddModal = () => {
    setMode(false);
    showModal();
  };

  

  const showEditModal = (id) => {
    userActions.getById(id);

    users.forEach(user => {
      if (user.id == id) {
        form.setFieldsValue({
          firstName: user.firstName,
          lastName: user.lastName,
          userame: user.username,
          password: user.password,
          mail: user.mail,
          patronymic: user.patronymic,
          imageFile: user.imageFile
        });
        setImage(user.imageFile);
        setMode(id);
        showModal();
      }
    });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setVisible(false);
    setImage(null);
  };

  function onSubmit(data) {
    setImage(null);
    return !mode ? createUser(data) : updateUser(user.id, data);
  }

  function createUser(data) {
    return userActions.register(data).then(() => {
      alertActions.success("Пользователь добавлен");
    });
  }

  function updateUser(id, data) {
    return userActions.update(id, data).then(() => {
      alertActions.success("Информация о пользователе обновлена");
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showAddModal}
        style={{ marginBottom: 16 }}
      >
        Добавить пользователя
      </Button>
      <Modal
        title={!mode ? "Добавить пользователя" : "Редактировать пользователя"}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <>
          {!loading && (
            <Form
              {...formItemLayout}
              onFinish={onSubmit}
              form={form}
              name="dataUser"
              scrollToFirstError
            >
              <Form.Item
                label="Имя пользователя"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите имя пользователя!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Пароль"
                name="password"
                rules={[
                  { required: true, message: "Пожалуйста, введите пароль!" },
                ]}
              >
                <Input.Password />
                {mode && <em className="ml-1">(Оставьте пустым, чтобы сохранить тот же пароль)</em>}
              </Form.Item>

              <Form.Item
                label="Фамилия"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите фамилию!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Имя"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите имя!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Отчество"
                name="patronymic"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите отчество!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="mail"
                label="Электронная почта"
                rules={[
                  {
                    type: "email",
                    message:
                      "Пожалуйста, введите действительный адрес электронной почты!",
                  },
                  {
                    required: true,
                    message: "Пожалуйста, введите адрес электронной почты!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Фотография профиля">
                <Avatar />
              </Form.Item>
              {/* <div className="form-group">
                        <button type="submit" disabled={confirmLoading} className="btn btn-primary mr-2">
                            {confirmLoading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Сохранить
                        </button>
                        <Link to="/users" className="btn btn-link">Отмена</Link>
                    </div> */}
            </Form>
          )}
          {loading && (
            <div className="text-center p-3">
              <Spin size="large" />
            </div>
          )}
        </>
      </Modal>
      <Table columns={columns} dataSource={data}></Table>
    </>
  );
}
