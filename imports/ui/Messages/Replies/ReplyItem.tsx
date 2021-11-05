import * as React from "react";
import {
  Avatar,
  Comment,
  Modal,
  message as toaster,
  Skeleton,
  Tooltip,
} from "antd";
import { Meteor } from "meteor/meteor";
import { IMessage } from "/imports/db/MessagesCollection";
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { checkIfAuthor, getAuthor, saveMessage } from "../../utils";
import { IRepliesListProps } from "./RepliesList";
import { ReplyEditor } from "./ReplyEditor";

interface IReplyItemProps extends IRepliesListProps {
  reply: IMessage;
}

export const ReplyItem = (props: IReplyItemProps) => {
  const { reply, user } = props;
  const [isVisible, setIsVisible] = React.useState(false);
  const { author, isLoading } = getAuthor(reply);
  const isAuthor = checkIfAuthor(reply, user);
  let actions;

  const submitComment = (message: string, isPrivate: boolean) => {
    saveMessage(
      message,
      isPrivate,
      "Comment successfully updated.",
      reply._id,
      reply
    );
    setIsVisible(false);
  };

  const deleteComment = () => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure to delete this comment?",
      onOk: () => {
        Meteor.call("messages.remove", reply._id, (error) => {
          if (error) {
            toaster.error("An error as occured");
          } else {
            toaster.success("Comment successfully deleted");
          }
        });
      },
    });
  };

  if (isAuthor) {
    actions = [
      <DeleteOutlined onClick={deleteComment} />,
      <EditOutlined onClick={() => setIsVisible(!isVisible)} />,
    ];
  }

  return (
    <div className="reply-item">
      {isLoading && <Skeleton active className="reply-loading" />}
      {author && (
        <>
          <Comment
            actions={actions}
            author={
              <>
                {author?.username}{" "}
                {reply?.isPrivate && (
                  <Tooltip title="This comment is in private mode">
                    <LockOutlined className="is-private" />
                  </Tooltip>
                )}
              </>
            }
            avatar={<Avatar src={author?.profile?.picture} />}
            content={<p>{reply?.message}</p>}
          />
          <ReplyEditor
            isVisible={isVisible}
            onSubmit={submitComment}
            reply={reply}
          />
        </>
      )}
    </div>
  );
};
