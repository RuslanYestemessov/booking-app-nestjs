import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CottageDocument = Cottage & Document

@Schema()
export class Cottage {
  @Prop()
  guests: number;

  @Prop()
  description: string;

  @Prop()
  photos: Array<string>;

  @Prop()
  videos: Array<string>;

  @Prop()
    // telegramId
  bookedByUser: number;

  @Prop()
  bookingExpired: number;
}

export const cottageSchema = SchemaFactory.createForClass(Cottage);
