/* eslint-disable react/react-in-jsx-scope */
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useUserActions, useAlertActions } from "_actions";

import { Avatar } from "./Avatar";
import { Card } from "antd";
import { Space } from "antd";
import { Form } from "antd";
import { Input } from "antd";
import { Button } from "antd";
import { Spin } from "antd";
import { avatarAtom } from "_state";
import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";
import { useState } from "react";

export { Register };

function Register({ history }) {
  const userActions = useUserActions();
  const alertActions = useAlertActions();

  const [avatar] = useRecoilState(avatarAtom);

  const [form] = Form.useForm();

  const { isSubmitting } = useState();

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

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  function onSubmit(data) {
    console.log(data);
    return userActions.register(data).then(() => {
      history.push("/account/login");
      alertActions.success("Регистрация успешно выполнена");
    });
  }

  const onFinish = (values) => {
    if (avatar == null) {
      values.imageName = "null";
      values.imageFile = "null";
    } else {
      values.imageName = avatar.name;
      values.imageFile = avatar.imageUrl;
    }
    onSubmit(values);
  };

  return (
    <Card
      hoverable
      style={{ width: 800 }}
      title="Форма регистрации"
      bordered={false}
    >
      {/* <form onSubmit={}> */}
      <Form
        form={form}
        {...formItemLayout}
        name="register"
        onFinish={onFinish}
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
          rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}
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
          label="Адрес электронной почты"
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

        <Form.Item {...tailFormItemLayout}>
          <Space>
            {!isSubmitting && (
              <Button htmlType="submit">Зарегистрироваться</Button>
            )}
            {isSubmitting && (
              <Button htmlType="submit">
                <Spin size="small" />
              </Button>
            )}
            <Button>
              <Link to="login">Отмена</Link>
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
