import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user-schema';
import { Model } from 'mongoose';
import { UserInterface } from '../types/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {
  }

  getAll() {
    return this.userModel.find({});
  }

  getOneByTelegramId(telegramId: number) {
    return this.userModel.findOne({ telegramId });
  }

  getOneByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({ phoneNumber });
  }

  addUser(createUserDto: UserInterface) {
    const createdUser = new this.userModel({
      telegramId: createUserDto.telegramId,
      phoneNumber: createUserDto.phoneNumber,
      userName: createUserDto.userName,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role,
      isDeleted: false
    });
    return createdUser.save();
  }

  addAdmin(phoneNumber: string) {
    return this.userModel.findOneAndUpdate({ phoneNumber }, { role: 'admin' });
  }

  removeAdmin(phoneNumber: string) {
    return this.userModel.findOneAndUpdate({ phoneNumber }, { role: 'user' });
  }

  updateAdminDetails(updateUserDto: UserInterface) {
    return this.userModel.findOneAndUpdate({ phoneNumber: updateUserDto.phoneNumber }, {
      telegramUserId: updateUserDto.telegramId,
      phoneNumber: updateUserDto.phoneNumber,
      userName: updateUserDto.userName,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      role: updateUserDto.role,
      isDeleted: false
    });
  }

  async removeUser(telegramUserId: number) {
    const userForDelete = await this.userModel.findOne({ telegramUserId });
    userForDelete.isDeleted = true;
    return this.userModel.updateOne({
      userForDelete
    });
  }
}
