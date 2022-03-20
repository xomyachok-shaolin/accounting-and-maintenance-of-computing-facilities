/* eslint-disable react/react-in-jsx-scope */
import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authAtom, adminAtom, collapseAtom } from "_state";
import { useUserActions } from "_actions";

import { Button, Descriptions, Divider, Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

import Icon from "@ant-design/icons";

import { ReactComponent as LogoSvg } from "../assets/maintenance.svg";
import { Space } from "antd";
import { Avatar } from "antd";
import { Image } from "antd";
import Title from "antd/lib/typography/Title";

const { Sider } = Layout;
const { SubMenu } = Menu;

export { Nav };

function Nav() {
  const auth = useRecoilValue(authAtom);
  const userActions = useUserActions();

  // const isAdmin = useRecoilValue(adminAtom);
  const collapsed = useRecoilValue(collapseAtom);

  // only show nav when logged in
  if (!auth) return null;

  return (
    <Sider
      theme="light"
      style={{
        overflow: "auto",
        height: "100vh",
        left: 0,
        top: 10,
        bottom: 0,
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={userActions.switchMenu}
    >
      <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
        <Space>
        <Avatar style={{marginLeft: 25,marginTop: 15}} src={<Image 
            src="https://joeschmoe.io/api/v1/random"
            style={{ width: 32}}
          />}/>
          {!collapsed && <Title style={{marginLeft: 10, marginTop: 25 }} level={5}>
            {auth.username}
          </Title>}
        </Space>
        <Divider />
        <Menu.Item key="0" icon={<Icon component={LogoSvg} />}>
          <NavLink exact to="/">
            Главная
          </NavLink>
        </Menu.Item>
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <SubMenu key="sub1" icon={<FileOutlined />} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<PoweroffOutlined />}>
          <a onClick={userActions.logout}>Выход</a>
        </Menu.Item>
      </Menu>
    </Sider>

    // <nav className="navbar navbar-expand navbar-dark bg-dark">
    //     <div className="navbar-nav">
    //         <NavLink exact to="/" className="nav-item nav-link">Главная</NavLink>
    //         {isAdmin && <NavLink to="/users" className="nav-item nav-link">Пользователи</NavLink>}
    //         <a onClick={userActions.logout} className="nav-item nav-link">Выход</a>
    //     </div>
    // </nav>
  );
}
