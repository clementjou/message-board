import * as React from "react";
import { Meteor } from "meteor/meteor";
import { Button, Modal, PageHeader, Tag } from "antd";
import { useTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import { AddMessageModal } from "./Messages/AddMessageModal";
import * as H from "history";
import { AntDesignOutlined, LogoutOutlined } from "@ant-design/icons";
import { reInitDatas } from "./utils";

interface IAppHeaderProps {
  history: H.History;
  location: H.Location;
}

const AppHeader = (props: IAppHeaderProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const { location } = props;
  const user = useTracker(() => Meteor.user());
  const isHomePage = location?.pathname === "/";
  const isLoginPage = location?.pathname === "/login";
  const actions = [];

  const logout = () => {
    Meteor.logout((error) => {
      if (!error) {
        props.history.push("/login");
      }
    });
  };

  const onReinitDatas = () => {
    Modal.confirm({
      title: "Reinitialize all datas",
      content:
        "You are about to delete all messages, Are you sure you want to continue ?",
      onOk() {
        reInitDatas();
      },
    });
  };

  if (user) {
    actions.push(
      <Button type="primary" onClick={() => setIsVisible(true)} key="add">
        Add a message
      </Button>,
      <Button icon={<LogoutOutlined />} onClick={() => logout()} key="1">
        Log out
      </Button>
    );
  }
  if (isLoginPage) {
    actions.push(
      <Button type="primary" onClick={onReinitDatas} key="add">
        Clean board
      </Button>
    );
  }
  return (
    <PageHeader
      title="Message Board"
      className="site-page-header"
      onBack={
        !isHomePage && !isLoginPage ? () => props.history.push("/") : null
      }
      tags={user && <Tag color="blue">Logged as : {user?.username}</Tag>}
      extra={actions}
      avatar={{
        icon: <AntDesignOutlined />,
      }}
    >
      <AddMessageModal
        successText="Message successfully created."
        modalTitle="Add a message"
        setIsVisible={setIsVisible}
        isVisible={isVisible}
      />
    </PageHeader>
  );
};

export default withRouter(AppHeader);
