import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import { useDeviceParameterActions, useAlertActions } from "_actions";
import { Form, Modal, Spin, Table, Tag, Input, Select, InputNumber } from "antd";
import { Space } from "antd";
import { Button } from "antd";
import { Avatar } from "account/Avatar";
import { useForm } from "react-hook-form";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deviceParametersAtom } from "_state";
import React from "react";

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

  const deviceParameters = useRecoilValue(deviceParametersAtom);

  const deviceParameterActions = useDeviceParameterActions();

  useEffect(() => {
    deviceParameterActions.getAll();
    return deviceParameterActions.resetDeviceParameters;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      deviceParameterActions.getAll();
      setIsResetAll(false);
    }
  }, [isResetAll]);

  const columns = [
    {
      title: "Наименование",
      dataIndex: "name",
      id: "name",
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

  const data = deviceParameters?.map(function (row) {
    return {
      key: row.id,
      name: row.name,
     };
  });

  const showModal = () => {
    setVisible(true);
  };

  const showAddModal = () => {
    setMode(false);
    form.setFieldsValue({
      name: "",
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
        deviceParameterActions.delete(id);
      },
      onCancel() { },
    });
  };

  const showEditModal = (id) => {
    deviceParameters.forEach((deviceParameter) => {
      if (deviceParameter.id === id) {
        form.setFieldsValue({
          name: deviceParameter.name,
        });
        setMode(deviceParameter);

        showModal();
      }
    });
  };

  function onSubmit(values) {

    setVisible(false);

    return !mode ? createDeviceParameter(values) : updateDeviceParameter(mode.id, values);
  }

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  function createDeviceParameter(data) {
    return deviceParameterActions.create(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Параметр устройства добавлен");
    });
  }

  function updateDeviceParameter(id, data) {
    //data.imageFile = avatar.imageFile;
    return deviceParameterActions.update(id, data).then(() => {
      setIsResetAll(true);
      alertActions.success("Информация о параметре устройства обновлена");
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
        Добавить параметр устройства
      </Button>
      <Modal
        title={!mode ? "Добавить параметр устройства" : "Редактировать параметр устройства"}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
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
                    message: "Пожалуйста, введите наименование параметра устройств!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

            </Form>
      </Modal>
      {(deviceParameters) && <Table locale={{emptyText:"Нет данных"}}  scroll={{ x: 800, }}
      bordered columns={columns} dataSource={data}></Table>}
      {!deviceParameters && (
        <div className="text-center p-3">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
