import * as React from "react";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Switch } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { IMessage } from "/imports/db/MessagesCollection";

interface IReplyEditorProps {
  onSubmit: (message: string, isPrivate: boolean) => void;
  isVisible: boolean;
  reply: IMessage;
}

export const ReplyEditor = (props: IReplyEditorProps) => {
  const { onSubmit, isVisible, reply } = props;
  const [message, setMessage] = React.useState(reply?.message);
  const [isPrivate, setIsPrivate] = React.useState(reply?.isPrivate || false);

  React.useEffect(() => {
    if (!props.isVisible && !reply) {
      setMessage('');
      setIsPrivate(false);
    }
  }, [props.isVisible])
  return (
    <div className="reply-editor">
      {isVisible ? (
        <Row>
          <Col xs={22} sm={22} md={8} lg={8} xl={8}>
            <Form.Item>
              <TextArea
                rows={4}
                onChange={(arg) => setMessage(arg.currentTarget?.value)}
                value={message}
              />
            </Form.Item>
            <Form.Item
              label="Private"
              name="private"
              labelCol={{ span: 22 }}
              wrapperCol={{ span: 2 }}
            >
              <Switch
                checked={isPrivate}
                onChange={(value) => setIsPrivate(value)}
                checkedChildren={<LockOutlined />}
                unCheckedChildren={<UnlockOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button

                disabled={!message}
                onClick={() => onSubmit(message, isPrivate)}
                type="primary"
              >
                {reply ? "Update comment" : "Add Comment"}
              </Button>
            </Form.Item>{" "}
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </div>
  );
};
