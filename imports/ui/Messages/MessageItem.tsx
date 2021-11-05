import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { Card, message as toaster, Modal, Skeleton, Tooltip } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Meta from "antd/lib/card/Meta";
import { Meteor } from "meteor/meteor";
import * as React from "react";
import { getAuthor } from "../utils";
import { AddMessageModal } from "./AddMessageModal";
import { IMessage } from "/imports/db/MessagesCollection";

interface IMessageItemProps {
  message: IMessage;
  history: any;
  isAuthor: boolean;
}

export const MessageItem = (props: IMessageItemProps) => {
  const [addIsVisible, setAddIsVisible] = React.useState(false);
  let actions;
  const { message, isAuthor } = props;
  const { author, isLoading } = getAuthor(message);
  if (message.isPrivate && !isAuthor) {
    return null;
  }

  const deleteItem = () => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure to delete this message?",
      onOk: () => {
        Meteor.call("messages.remove", message._id, (error) => {
          if (error) {
            toaster.error("An error as occured");
          } else {
            toaster.success("Thread successfully deleted");
          }
        });
      },
    });
  };

  if (isAuthor) {
    actions = [
      <EditOutlined
        onClick={(arg) => {
          arg.stopPropagation();
          setAddIsVisible(true);
        }}
        key="edit"
      />,
      <DeleteOutlined
        onClick={(arg) => {
          arg.stopPropagation();
          deleteItem();
        }}
        key="delete"
      />,
    ];
  }
  return (
    <>
      <Card
        onClick={() => props.history.push(`message/${props.message?._id}`)}
        style={{ width: 320, marginTop: 16 }}
        className="message-container"
        actions={actions}
      >
        <Skeleton loading={isLoading} avatar active>
          <Meta
            avatar={<Avatar src={author?.profile?.picture || ""} />}
            title={author?.username}
            description={
              message.message?.length > 30
                ? message.message.slice(0, 30) + "..."
                : message.message
            }
          />
          {message?.isPrivate && (
            <Tooltip title="This message is in private mode">
              <LockOutlined className="is-private" />
            </Tooltip>
          )}
        </Skeleton>
      </Card>
      <AddMessageModal
        successText="Message successfully updated."
        modalTitle="Update a message"
        setIsVisible={setAddIsVisible}
        isVisible={addIsVisible}
        data={message}
      />
    </>
  );
};
