import { Col, Empty, Row, Spin } from "antd";
import * as H from "history";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { useTracker } from "meteor/react-meteor-data";
import * as React from "react";
import { IMessage, MessagesCollection } from "../../db/MessagesCollection";
import { checkIfAuthor, checkIfPrivate } from "../utils";
import { MessageFilters } from "./MessageFilters";
import { MessageItem } from "./MessageItem";
import "./index.less";

interface IMessageBoardProps {
  history: H.History;
}

export const MessageBoard = (props: IMessageBoardProps) => {
  const [hideMyMessages, setHideMyMessages] = React.useState(false);
  const [showOnlyMyMessages, setShowOnlyMyMessages] = React.useState(false);

  const user = useTracker(() => Meteor.user());

  const getMessages = (filters: Mongo.Selector<IMessage>) => {
    return MessagesCollection.find(filters).fetch();
  };

  let { messages, filteredMessages, isLoading, noMessages } = useTracker(() => {
    if (!Meteor.user()) {
      return { messages: [] };
    }

    const handler = Meteor.subscribe("messages");

    if (!handler.ready()) {
      return { messages: [], isLoading: true };
    }

    let messages = getMessages({ parentId: null }).filter((message) =>
      checkIfPrivate(message, user)
    );
    let filteredMessages;
    if (messages?.length) {
      if (hideMyMessages) {
        filteredMessages = messages?.filter((message) => {
          return message?.authorId !== user._id;
        });
      } else if (showOnlyMyMessages) {
        filteredMessages = messages?.filter((message) => {
          return message?.authorId === user._id;
        });
      } else {
        filteredMessages = messages;
      }
    }
    return { messages, filteredMessages, noMessages: !messages?.length };
  });

  return (
    <div className="message-board">
      {messages?.length ? (
        <MessageFilters
          showOnlyMyMessages={showOnlyMyMessages}
          setShowOnlyMyMessages={setShowOnlyMyMessages}
          hideMyMessages={hideMyMessages}
          setHideMyMessages={setHideMyMessages}
        />
      ) : null}
      <Row align="top">
        {isLoading && <Spin className="messages-loading" />}
        {!isLoading && filteredMessages?.length
          ? filteredMessages.map((message) => {
              const isAuthor = checkIfAuthor(message, user);
              return (
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={6}
                  className="message-col gutter-row"
                >
                  <MessageItem
                    isAuthor={isAuthor}
                    history={props.history}
                    message={message}
                  />
                </Col>
              );
            })
          : null}
        {noMessages && (
          <Empty description="No messages" className="no-messages" />
        )}
      </Row>
    </div>
  );
};
