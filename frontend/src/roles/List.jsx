import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import { useUserActions, useAlertActions } from "_actions";
import { Form, Modal, Spin, Table, Tag, Input, Select } from "antd";
import { Space } from "antd";
import { Button } from "antd";
import { Avatar } from "account/Avatar";
import { useForm } from "react-hook-form";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import { rolesAtom } from "_state/roles";
import Checkbox from "antd/lib/checkbox/Checkbox";

export { List };

function List({ match }) {
  const [form] = Form.useForm();

  const alertActions = useAlertActions();

  const [loading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [confirmLoading] = useState(false);

  const [mode, setMode] = useState(false);
  const [isResetAll, setIsResetAll] = useState(false);

  const { confirm } = Modal;

  const roles = useRecoilValue(rolesAtom);
  const userActions = useUserActions();
  // const role = useRecoilValue(roleAtom);

  useEffect(() => {
    userActions.getAllRoles();
  }, []);

  useEffect(() => {
    if (isResetAll) {
      userActions.getAllRoles();
      setIsResetAll(false);
    }
  }, [isResetAll, userActions]);

  const columns = [
    {
      title: "Наименование",
      dataIndex: "name",
      id: "name",
    },
    {
      title: "Может списывать оборудование",
      key: "isWriteOff",
      render: (t, r) => <Checkbox checked={r.isWriteOff}> </Checkbox>,
    },
    {
      title: "Может перемещать оборудование",
      key: "isTransfer",
      render: (t, r) => <Checkbox checked={r.isTransfer}> </Checkbox>,
    },
    {
      title: "Может модернизировать АРМ",
      key: "isUpgrade",
      render: (t, r) => <Checkbox checked={r.isUpgrade}> </Checkbox>,
    },
    {
      title: "Может редактировать АРМ",
      key: "isEditWS",
      render: (t, r) => <Checkbox checked={r.isEditWS}> </Checkbox>,
    },
    {
      title: "Может редактировать задачи",
      key: "isEditTask",
      render: (t, r) => <Checkbox checked={r.isEditTask}> </Checkbox>,
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

  const data = roles?.map(function (row) {
    return {
      key: row.id,
      name: row.name,
      isWriteOff: row.isWriteOff,
      isTransfer: row.isTransfer,
      isUpgrade: row.isUpgrade,
      isEditWS: row.isEditWS,
      isEditTask: row.isEditTask,
    };
  });

  const showModal = () => {
    setVisible(true);
  };

  const showAddModal = () => {
    setMode(false);
    form.setFieldsValue({
      name: "",
      isWriteOff: false,
      isTransfer: false,
      isUpgrade: false,
      isEditWS: false,
      isEditTask: false,
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
        userActions.deleteRole(id);
      },
      onCancel() {},
    });
  };

  const showEditModal = (id) => {
    roles.forEach((role) => {
      if (role.id === id) {
        form.setFieldsValue({
          name: role.name,
          isWriteOff: role.isWriteOff,
          isTransfer: role.isTransfer,
          isUpgrade: role.isUpgrade,
          isEditWS: role.isEditWS,
          isEditTask: role.isEditTask,
        });
        setMode(role);

        showModal();
      }
    });
  };

  function onSubmit(values) {

    if (!values.isEditTask) values.isEditTask = false;
    else values.isEditTask = true;
    if (!values.isEditWS) values.isEditWS = false;
    else values.isEditWS = true;
    if (!values.isTransfer) values.isTransfer = false;
    else values.isTransfer = true;
    if (!values.isUpgrade) values.isUpgrade = false;
    else values.isUpgrade = true;
    if (!values.isWriteOff) values.isWriteOff = false;
    else values.isWriteOff = true;

    setVisible(false);

    return !mode ? createRole(values) : updateRole(mode.id, values);
  }

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  function createRole(data) {
    return userActions.createRole(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Роль добавлена");
    });
  }

  function updateRole(id, data) {
    //data.imageFile = avatar.imageFile;
    return userActions.updateRole(id, data).then(() => {
      setIsResetAll(true);
      alertActions.success("Информация о роли обновлена");
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
        Добавить роль
      </Button>
      <Modal
        title={!mode ? "Добавить роль" : "Редактировать роль"}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <>
          {!loading && (
            <Form
              {...formItemLayout}
              form={form}
              scrollToFirstError
              name="formName"
              onFinish={onSubmit}
            >
              <Form.Item
                label="Наименование"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите наименование!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                wrapperCol={{ offset: 5, span: 16 }}
                name="isWriteOff"
                valuePropName="checked"
              >
                <Checkbox>Может списывать оборудование</Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{ offset: 5, span: 16 }}
                name="isTransfer"
                valuePropName="checked"
              >
                <Checkbox>Может перемещать оборудование</Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{ offset: 5, span: 16 }}
                name="isUpgrade"
                valuePropName="checked"
              >
                <Checkbox>Может модернизировать АРМ</Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{ offset: 5, span: 16 }}
                name="isEditWS"
                valuePropName="checked"
              >
                <Checkbox>Может редактировать АРМ</Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{ offset: 5, span: 16 }}
                name="isEditTask"
                valuePropName="checked"
              >
                <Checkbox>Может редактировать задачи</Checkbox>
              </Form.Item>
            </Form>
          )}
          {confirmLoading && (
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
