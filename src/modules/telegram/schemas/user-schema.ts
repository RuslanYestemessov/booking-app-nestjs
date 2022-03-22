import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../types/roles';

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop()
  phoneNumber: string;

  @Prop()
  telegramId: number;

  @Prop()
  userName: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  role: Roles;

  @Prop()
  isDeleted: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);
