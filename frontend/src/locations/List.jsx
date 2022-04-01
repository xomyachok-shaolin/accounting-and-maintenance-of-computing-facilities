import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import { useLocationActions, useAlertActions } from "_actions";
import { Form, Modal, Spin, Table, Tag, Input, Select } from "antd";
import { Space } from "antd";
import { Button } from "antd";
import { Avatar } from "account/Avatar";
import { useForm } from "react-hook-form";
import { ExclamationCircleOutlined, SearchOutlined, MinusCircleTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import { employeesAtom, locationsAtom } from "_state";
import React from "react";
const { Option } = Select;

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

  const locations = useRecoilValue(locationsAtom);

  const locationActions = useLocationActions();

  const employees = useRecoilValue(employeesAtom);

  useEffect(() => {
    locationActions.getAll();
    return locationActions.resetLocations;
  }, []);

  
  useEffect(() => {
    locationActions.getAllEmployees();
    return locationActions.resetEmployees;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      locationActions.getAll();
      setIsResetAll(false);
    }
  }, [isResetAll]);

  const columns = [
    {
      title: "№ здания",
      dataIndex: "house",
      id: "house",
    },
    {
      title: "№ помещения",
      dataIndex: "room",
      id: "room",
    },
    Table.EXPAND_COLUMN,
    {
      title: "Ответственный",
      dataIndex: "employee",
      id: "employee",
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

  const data = locations?.map(function (row) {
    return {
      key: row.id,
      house: row.house,
      room: row.room,
      employee: row.employee?.personnelNumber,
      description: row.employee?.department + ': ' + row.employee?.position +
        ' ' + row.employee?.lastName + ' ' + row.employee?.firstName + ' ' + row.employee?.patronymic
    };
  });

  const showModal = () => {
    setVisible(true);
  };

  const showAddModal = () => {
    setMode(false);
    form.setFieldsValue({
      house: "",
      room: "",
      employee: "",
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
        locationActions.delete(id);
      },
      onCancel() { },
    });
  };

  const showEditModal = (id) => {
    locations.forEach((location) => {
      if (location.id === id) {
        form.setFieldsValue({
          house: location.house,
          room: location.room,
          responsible: location?.employee?.id,
        });
        setMode(location);

        showModal();
      }
    });
  };

  function onSubmit(values) {

    setVisible(false);

    return !mode ? createLocation(values) : updateLocation(mode.id, values);
  }

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  function createLocation(data) {
    return locationActions.create(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Местоположение добавлено");
    });
  }

  function updateLocation(id, data) {
    //data.imageFile = avatar.imageFile;
    return locationActions.update(id, data).then(() => {
      setIsResetAll(true);
      alertActions.success("Информация о местоположении обновлена");
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
        Добавить местоположение
      </Button>
      <Modal
        title={!mode ? "Добавить местоположение" : "Редактировать местоположение"}
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
                label="Здание"
                name="house"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите номер здания!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Помещение"
                name="room"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите номер помещения!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="responsible"
                label="Ответственный"
              >
                <Select
                  notFoundContent="Сотрудник не найден"
                  showSearch
                  placeholder="Выберите ответственного за помещение"
                  optionFilterProp="children"
                    value={employees}
                  allowClear
                >
                  {employees?.map((e) => (
                    <Select value={e.id} key={e.id}>
                      {e.personnelNumber} {e.lastName} {e.firstName} {e.patronymic} {e.department} {e.position}
                    </Select>
                  ))}
                </Select>
              </Form.Item>
            </Form>
      </Modal>
      {(locations && employees) && <Table scroll={{ x: 800, }}
      bordered columns={columns} expandable={{
        expandedRowRender: record => {if (record.employee) return <p style={{ margin: 0 }}>{record.description}</p>;
          else return <p style={{ margin: 0 }}>Ответственный за помещение не определен</p>;},
        
  }} dataSource={data}></Table>}
      {(!employees || !locations) && (
        <div className="text-center p-3">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
