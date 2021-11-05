import { Mongo } from 'meteor/mongo';

export interface IMessage {
    _id?: string;
    message: string;
    createdAt: Date;
    authorId: string;
    isPrivate?: boolean;
    parentId?: string;
}

 
export const MessagesCollection = new Mongo.Collection<IMessage>('mesages');