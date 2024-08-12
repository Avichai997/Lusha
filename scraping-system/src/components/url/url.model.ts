import { Schema, model } from 'mongoose';
import { UrlType } from '../../types';

const urlSchema = new Schema<UrlType>(
  {
    url: { type: String, required: true, unique: true },
    html: { type: String, required: true },
    links: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ChatRoom = model<UrlType>('Url', urlSchema);

export default ChatRoom;
