import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from "/imports/db/MessagesCollection";

function CheckIfIsFromCurrentUser(messageId: string, userId: string) {
    const message = MessagesCollection.findOne({ _id: messageId, authorId: userId });
    if (!message) {
        return false
    }
    return true;
}

Meteor.methods({
    'messages.insert'(message: string, isPrivate?: boolean, parentId?: string) {
        check(message, String);
        check(isPrivate, Boolean);
        check(parentId, Match.Optional(Match.OneOf(String, null)));

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        try {
            return MessagesCollection.insert({
                message,
                createdAt: new Date,
                isPrivate: isPrivate,
                authorId: this.userId,
                parentId: parentId
            })
        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },
    'messages.remove'(messageId) {
        check(messageId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        if (!CheckIfIsFromCurrentUser(messageId, this.userId)) {
            throw new Meteor.Error('Access denied.');
        }

        return MessagesCollection.remove(messageId);
    },
    'messages.update'(messageId, message, isPrivate) {
        check(messageId, String);
        check(message, String);
        check(isPrivate, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        if (!CheckIfIsFromCurrentUser(messageId, this.userId)) {
            throw new Meteor.Error('Access denied.');
        }

        return MessagesCollection.update(messageId, {
            $set: {
                isPrivate,
                message
            }
        });
    },
    'messages.reply.insert'(reply: string, parentId: string, isPrivate?: boolean) {
        MessagesCollection.insert({
            message: reply,
            authorId: this.userId,
            parentId: parentId,
            isPrivate: isPrivate,
            createdAt: new Date,
        })
    },
    'messages.reinit'() {
        if (MessagesCollection.rawCollection()) {
            MessagesCollection.rawCollection()?.drop();
        } else {
            throw new Meteor.Error('No messages.');
        }
    }
});