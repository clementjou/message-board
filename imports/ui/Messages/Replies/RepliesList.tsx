import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import * as React from "react";
import { checkIfPrivate } from "../../utils";
import { ReplyItem } from "./ReplyItem";
import { MessagesCollection } from "/imports/db/MessagesCollection";

export interface IRepliesListProps {
  messageId: string;
  user: Meteor.User;
}

export const RepliesList = (props: IRepliesListProps) => {
  const { messageId, user } = props;
  const replies = useTracker(() => {
    if (!Meteor.user()) {
      return [];
    }

    const handler = Meteor.subscribe("messages");

    if (!handler.ready()) {
      return { ...[], isLoading: true };
    }
    return MessagesCollection.find({ parentId: messageId }).fetch();
  });

  return (
    <div className="replies-list">
      {replies?.length
        ? replies
            .filter((reply) => {
              return checkIfPrivate(reply, user);
            })
            .map((reply, index) => {
              return <ReplyItem key={`reply-${index}`} {...props} reply={reply} />;
            })
        : null}
    </div>
  );
};
