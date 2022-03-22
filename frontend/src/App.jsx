/* eslint-disable react/react-in-jsx-scope */
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authAtom } from "_state";
import { Nav, Alert, PrivateRoute } from "_components";
import { history } from "_helpers";
import { Home } from "home";
import { Users } from "users";
import { Account } from "account";

import { Layout, Breadcrumb, Button, Avatar, Image, Space } from "antd";

import { PoweroffOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Header } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";

const { Content, Footer } = Layout;

export { App };

function App() {
  const auth = useRecoilValue(authAtom);

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Router history={history}>
        <Nav />

        {auth && (
          <Layout className="site-layout">
            <Content style={{ margin: "16px 16px" }}>
              <Alert />

              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute path="/users" component={Users} />
                <Redirect from="*" to="/" />
              </Switch>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Учет и техническое обслуживание вычислительных средств ©2022
              ASMinaev@mephi.ru
            </Footer>
          </Layout>
        )}
        {!auth && (
          <>
            <Alert />
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <PrivateRoute path="/users" component={Users} />
              <Route path="/account" component={Account} />
              <Redirect from="*" to="/" />
            </Switch>

            <Footer style={{ textAlign: "center" }}>
              Учет и техническое обслуживание вычислительных средств ©2022
              ASMinaev@mephi.ru
            </Footer>
          </>
        )}
      </Router>
    </Layout>
  );
}
