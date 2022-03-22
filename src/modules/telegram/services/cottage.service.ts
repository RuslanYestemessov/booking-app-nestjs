import { Injectable } from '@nestjs/common';
import { Cottage, CottageDocument } from '../schemas/cottage.schema';
import { Model } from 'mongoose';
import { CottageInterface, UpdateCottageDto } from '../types/cottage.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CottageService {
  constructor(@InjectModel(Cottage.name) private readonly cottageModel: Model<CottageDocument>) {
  }

  getAll() {
    return this.cottageModel.find();
  }

  getFreeCottages() {
    return this.cottageModel.find({ bookedByUser: null });
  }

  getOneById(id: string) {
    return this.cottageModel.findById(id);
  }

  getBookedForUser(bookedByUser: number) {
    return this.cottageModel.find({ bookedByUser });
  }

  addCottage(cottageDto: CottageInterface) {
    const newCottage = new this.cottageModel({
      description: cottageDto.description,
      photos: cottageDto.photos
    });
    return newCottage.save();
  }

  updateCottage(id: string, updateCottageDto: UpdateCottageDto) {
    return this.cottageModel.findByIdAndUpdate(id, updateCottageDto);
  }
}
