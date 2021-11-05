import { Avatar, Comment, Skeleton } from "antd";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import * as React from "react";
import { match } from "react-router";
import { getAuthor, getMessage, saveMessage } from "../utils";
import { RepliesList } from "./Replies/RepliesList";
import { ReplyEditor } from "./Replies/ReplyEditor";
import { IMessage } from "/imports/db/MessagesCollection";

interface IMessageDetailProps {
  message: IMessage;
  match: match<{ id: string }>;
}

export const MessageDetail = (props: IMessageDetailProps) => {
  const messageId = props.match?.params?.id;
  const {message} = getMessage(messageId);
  const {author, isLoading} = getAuthor(message);
  const user = useTracker(() => Meteor.user());
  const [addCommentIsVisible, setAddCommentIsVisible] = React.useState(false);

  const submitComment = (reply: string, isPrivate: boolean) => {
    saveMessage(reply, isPrivate, "Comment successfully added.", message?._id);
    setAddCommentIsVisible(false);
  };
  return (
    <div className="message-detail">
      {isLoading && <Skeleton active className="reply-loading" />}
      {author && <Comment
        className="detail"
        actions={[
          <span
            onClick={() => setAddCommentIsVisible(!addCommentIsVisible)}
            key="comment-nested-reply-to"
          >
            Reply to
          </span>,
        ]}
        author={<a>{author?.username}</a>}
        avatar={
          <Avatar className="profile-picture" src={author?.profile?.picture} alt="Han Solo" />
        }
        content={<p className="message">{message?.message}</p>}
      >
        <ReplyEditor
          isVisible={addCommentIsVisible}
          onSubmit={submitComment}
          reply={null}
        />
        <RepliesList user={user} messageId={messageId} />
      </Comment>}
    </div>
  );
};
