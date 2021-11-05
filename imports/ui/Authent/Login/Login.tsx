import { CheckCircleFilled, LoginOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, message } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import * as React from "react";
import { getUsers } from "../../utils";
import "./index.less";
const { Title } = Typography;

export const Login = (props: any) => {
  const [selectedUser, setSelectedUser] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { users } = getUsers();

  useTracker(() => {
    const isLoggedIn = Meteor.userId() !== null;
    if (isLoggedIn) {
      props.history.push("/");
    }
  });

  const logIn = (selectedUser: string) => {
    setIsLoading(true);
    Meteor.loginWithPassword(selectedUser, "password", (err) => {
      if (err) {
        message.error("Login failed");
      } else {
        message.success(`Welcome ${selectedUser} !`);
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="login-page">
      <Title level={2}>Choose your profile</Title>
      <Row
        align="middle"
        justify="center"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      >
        {users?.length
          ? users.map((user, index) => {
              const isSelected = selectedUser === user?.username;
              return (
                <Col xs={24} sm={24} md={8} lg={8} xl={8} className="user-row">
                  <div
                    onClick={() => setSelectedUser(user?.username)}
                    className={`test-user ${isSelected ? "selected" : ""}`}
                  >
                    <Avatar
                      className="login-avatar"
                      src={user?.profile?.picture}
                      size={128}
                    >{`user ${index + 1}`}</Avatar>
                    {isSelected && (
                      <CheckCircleFilled className="user-selected-check" />
                    )}
                    <Title className="user-name" level={3}>
                      {user?.username}
                    </Title>
                  </div>
                </Col>
              );
            })
          : null}
        <Button
          type="primary"
          shape="round"
          loading={isLoading}
          onClick={() => logIn(selectedUser)}
          disabled={!selectedUser}
          icon={<LoginOutlined />}
          size="large"
        >
          Login
        </Button>
      </Row>
    </div>
  );
};
