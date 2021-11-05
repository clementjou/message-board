import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { IMessage, MessagesCollection } from "/imports/db/MessagesCollection";
import { message as toaster } from "antd";


export const checkIfAuthor = (message: IMessage, user: Meteor.User) => {
    return user?._id === message?.authorId;
}

export const checkIfPrivate = (message: IMessage, user: Meteor.User) => {
    if (message.isPrivate) {
        return user?._id === message?.authorId;
    } else {
        return true;
    }
}

export const getAuthor = (message: IMessage) => {
    return useTracker(() => {
        if (!Meteor.user()) {
            return { author: null };
        }

        const handler = Meteor.subscribe("users");

        if (!handler.ready()) {
            return { isLoading: true };
        }
        const author = Meteor.users.findOne({ _id: message?.authorId });
        return { author }

    })
}

export const getMessage = (messageId: string) => {
    return useTracker(() => {
        let message;
        if (!Meteor.user()) {
            return { message };
        }

        const handler = Meteor.subscribe("messages");

        if (!handler.ready()) {
            return { message };
        }
        message = MessagesCollection.findOne({ _id: messageId });
        return { message }

    })
}

export const saveMessage = (message: string, isPrivate: boolean, successText: string, parentId?: string, data?: IMessage) => {
    return new Promise((resolve, reject) => {
        if (!data) {
            Meteor.call(
                "messages.insert",
                message,
                isPrivate,
                parentId,
                (error) => {
                    if (error) {
                        toaster.error("An error as occured.");
                        reject()
                    } else {
                        toaster.success(successText);
                        resolve(true);
                    }
                }
            );
        } else {
            Meteor.call(
                "messages.update",
                data._id,
                message,
                isPrivate,
                (error) => {
                    if (error) {
                        toaster.error("An error as occured.");
                        reject();
                    } else {
                        toaster.success(successText);
                        resolve(true);
                    }
                }
            );
        }
    });
};

export const reInitDatas = () => {
    return new Promise(() => {
        Meteor.call('messages.reinit', (error) => {
            if (error) {
                toaster.error("An error has occured.");
            } else {
                toaster.success("Datas have been reinitialized.");
            }
        })
    })
}

export const getUsers = () => {
    return useTracker(() => {
        const handler = Meteor.subscribe("users");

        if (!handler.ready()) {
            return { users: [] };
        }
        const users = Meteor.users.find().fetch();
        return { users }

    })
}
