import * as React from "react";
import { Button, Form, Modal, Switch } from "antd";
import { IMessage } from "/imports/db/MessagesCollection";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { saveMessage } from "../utils";
import TextArea from "antd/lib/input/TextArea";

interface IAddMessageModal {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  data?: IMessage;
  parentId?: string;
  modalTitle?: string;
  successText: string;
}

export const AddMessageModal = (props: IAddMessageModal) => {
  const { parentId, data, modalTitle, isVisible, setIsVisible, successText } =
    props;
  const [message, setMessage] = React.useState(null);
  const [isPrivate, setIsPrivate] = React.useState(false);

  const handleSave = () => {
    saveMessage(message, isPrivate, successText, parentId, data).then(() => {
      setIsVisible(false);
    });
  };

  React.useEffect(() => {
    setMessage(data?.message);
    setIsPrivate(data?.isPrivate || false)
  }, [isVisible])
  return (
    <Modal
      title={modalTitle?.toUpperCase()}
      destroyOnClose={true}
      visible={isVisible}
      onOk={handleSave}
      onCancel={() => setIsVisible(false)}
      footer={[
        <Button key="back" onClick={() => setIsVisible(false)}>
          Cancel
        </Button>,
        <Button disabled={!message} key="submit" type="primary" onClick={handleSave}>
          Submit
        </Button>,
      ]}
    >
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        initialValues={{ private: isPrivate, message: message }}
        onChange={(arg) => arg.currentTarget}
        autoComplete="off"
      >
        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: "Insert your message here" }]}
        >
          <TextArea
            value={data?.message}
            onChange={(arg) => setMessage(arg.currentTarget.value)}
            rows={4}
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
      </Form>
    </Modal>
  );
};
