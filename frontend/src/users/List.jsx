import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import { usersAtom, imageAtom, avatarAtom } from "_state";
import { useUserActions, useAlertActions } from "_actions";
import { Form, Modal, Spin, Table, Tag, Input, Select } from "antd";
import { Space } from "antd";
import { Button } from "antd";
import { Avatar } from "account/Avatar";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import { rolesAtom } from "_state/roles";
import React from "react";

export { List };

function List({ match }) {
  const [form] = Form.useForm();

  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();
  const alertActions = useAlertActions();

  const [loading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [confirmLoading] = useState(false);

  const [mode, setMode] = useState(false);
  const [isResetAll, setIsResetAll] = useState(false);

  const [avatar] = useRecoilState(avatarAtom);
  const [image, setImage] = useRecoilState(imageAtom);

  const { confirm } = Modal;

  const rolesA = useRecoilValue(rolesAtom);

  useEffect(() => {
    userActions.getAll();
    userActions.getAllRoles();
  },[]);

  useEffect(() => {
    if (isResetAll) {
      userActions.getAll();
      setIsResetAll(false);
    }
  }, [isResetAll]);

  const columns = [
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
      render: roles => (
        <>
          {roles?.map((role) => {
            var name = role.name;
            var color = "geekblue";
            if (name === "Администратор") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={name}>
                {name.toUpperCase()}
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
            onClick={() => showDeleteModal(record.key)}
            disabled={record.isDeleting}
          >
            {record.isDeleting ? <Spin /> : <span>Удалить</span>}
          </Button>
        </Space>
      ),
    },
  ];

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

  const showModal = () => {
    setVisible(true);
  };

  const showAddModal = () => {
    setMode(false);
    setImage(null);
    form.setFieldsValue({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      mail: "",
      patronymic: "",
      roles: [],
    });
    showModal();
  };

  const showDeleteModal = (id) => {
    confirm({
      title: "Вы уверены что хотите удалить запись?",
      icon: <ExclamationCircleOutlined />,
      okText: "Да",
      cancelText: "Отмена",
      onOk() {
        userActions.delete(id);
      },
      onCancel() {},
    });
  };

  const showEditModal = (id) => {
    users.forEach((user) => {
      if (user.id == id) {
        form.setFieldsValue({
          username: user.username,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          mail: user.mail,
          patronymic: user.patronymic,
          roles: user.roles.map((r) => r.id),
        });
        setMode(user);

        showModal();
      }
    });
  };

  function onSubmit(values) {
    setVisible(false);
    return !mode ? createUser(values) : updateUser(mode.id, values);
  }

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  function createUser(data) {
    return userActions.register(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Пользователь добавлен");
    });
  }

  function updateUser(id, data) {
    //data.imageFile = avatar.imageFile;
    return userActions.update(id, data).then(() => {
      setIsResetAll(true);
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
      sm: { span: 12 },
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
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <>
            <Form
              {...formItemLayout}
              form={form}
              scrollToFirstError
              name="formName"
              onFinish={onSubmit}
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

              <Form.Item
                name="roles"
                label="Роли"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, выберите роли!",
                    type: "array",
                  },
                ]}
              >
                <Select
                  //defaultValue={selectedRoles?.map((r) => r.id)}
                  mode="multiple"
                  value={rolesA}
                  placeholder="Пожалуйста, выберите роли"
                >
                  {rolesA?.map((role) => (
                    <Select.Option value={role.id} key={role.id}>
                      {role.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <div className="form-group">
                        <button type="submit" disabled={confirmLoading} className="btn btn-primary mr-2">
                            {confirmLoading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Сохранить
                        </button>
                        <Link to="/users" className="btn btn-link">Отмена</Link>
                    </div> */}
            </Form>
        </>
      </Modal>
      {users && <Table 
      scroll={{ x: 800, }}
      bordered columns={columns} dataSource={data}></Table>}
      {!users && (
            <div className="text-center p-3">
              <Spin size="large" />
            </div>
          )}
    </>
  );
}
