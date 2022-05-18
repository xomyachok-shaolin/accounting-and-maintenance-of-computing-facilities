import { useEffect, useState } from "react";
import { useRecoilValue,  } from "recoil";

import { useDeviceTypeActions, useAlertActions } from "_actions";
import { Form, Modal, Spin, Table, Tag, Input, Select, InputNumber } from "antd";
import { Space } from "antd";
import { Button } from "antd";
import { Avatar } from "account/Avatar";
import { useForm } from "react-hook-form";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deviceTypesAtom } from "_state";
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

  const deviceTypes = useRecoilValue(deviceTypesAtom);

  const deviceTypeActions = useDeviceTypeActions();

  useEffect(() => {
    deviceTypeActions.getAll();
    return deviceTypeActions.resetDeviceTypes;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      deviceTypeActions.getAll();
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
      title: "Минимальное количество",
      dataIndex: "minimalQuantity",
      id: "minimalQuantity",
    },
    {
      title: "Текущее количество",
      dataIndex: "currentQuantity",
      id: "currentQuantity",
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

  const data = deviceTypes?.map(function (row) {
    return {
      key: row.id,
      name: row.name,
      minimalQuantity: row.minimalQuantity,
      currentQuantity: row.currentQuantity,
     };
  });

  const showModal = () => {
    setVisible(true);
  };

  const showAddModal = () => {
    setMode(false);
    form.setFieldsValue({
      name: "",
      minimalQuantity: "",
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
        deviceTypeActions.delete(id);
      },
      onCancel() { },
    });
  };

  const showEditModal = (id) => {
    deviceTypes.forEach((deviceType) => {
      if (deviceType.id === id) {
        form.setFieldsValue({
          name: deviceType.name,
          minimalQuantity: deviceType.minimalQuantity,
        });
        setMode(deviceType);

        showModal();
      }
    });
  };

  function onSubmit(values) {

    setVisible(false);

    return !mode ? createDeviceType(values) : updateDeviceType(mode.id, values);
  }

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  function createDeviceType(data) {
    return deviceTypeActions.create(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Вид устройства добавлен");
    });
  }

  function updateDeviceType(id, data) {
    //data.imageFile = avatar.imageFile;
    return deviceTypeActions.update(id, data).then(() => {
      setIsResetAll(true);
      alertActions.success("Информация о виде устройства обновлена");
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 11 },
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
        Добавить вид устройства
      </Button>
      <Modal
        title={!mode ? "Добавить вид устройства" : "Редактировать вид устройства"}
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
                    message: "Пожалуйста, введите наименование вида устройств!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Минимальное количество"
                name="minimalQuantity"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, укажите минимальное количество устройств данного вида!",
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>

            </Form>
      </Modal>
      {(deviceTypes) && <Table locale={{emptyText:"Нет данных"}} 
        pagination={false} scroll={{ x: 800, }}
      bordered columns={columns} dataSource={data}></Table>}
      {!deviceTypes && (
        <div className="text-center p-3">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
