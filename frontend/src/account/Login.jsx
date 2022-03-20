/* eslint-disable react/react-in-jsx-scope */
import { Link } from "react-router-dom";

import { useUserActions } from "_actions";

import { Card, Form, Input, Space, Spin } from "antd";
import { Button } from "antd";
import { useRecoilValue } from "recoil";
import { submitAtom } from "_state";

export { Login };

function Login() {
  const userActions = useUserActions();

  const [form] = Form.useForm();

  const isSubmitting = useRecoilValue(submitAtom);

  const onFinish = (values) => {
    userActions.login(values);
  };

  return (
    <Card hoverable title="Форма входа" style={{ width: 700 }} bordered={false}>
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 13 }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        name="control-hooks"
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

        <Form.Item wrapperCol={{ offset: 7, span: 13 }}>
          <Space>
            {!isSubmitting && <Button htmlType="submit">Войти</Button>}
            {isSubmitting && (
              <Button htmlType="submit">
                <Spin size="small" />
              </Button>
            )}
            <Button>
              <Link to="register">Зарегистрироваться</Link>
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
