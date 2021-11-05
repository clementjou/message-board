import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../../db/MessagesCollection';

Meteor.publish('messages', function publishMessages() {
  return MessagesCollection.find({});
});