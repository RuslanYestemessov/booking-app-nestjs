import { Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schemas/user-schema';
import { Cottage, cottageSchema } from './schemas/cottage.schema';
import { UserService } from './services/user.service';
import { CottageService } from './services/cottage.service';
import { HttpModule } from '@nestjs/axios';
import { FilesService } from './services/files.service';
import { AuthorizationScene } from './scenes/authorization.scene';
import { MainScene } from './scenes/main.scene';
import { BookARoomScene } from './scenes/book-a-room.scene';
import { AddNewCottagePhotosScene } from './scenes/add-new-cottage-photos.scene';
import { AdministrationStartScene } from './scenes/administration-start.scene';
import { EditAdministratorsScene } from './scenes/edit-administrators.scene';
import { EditCottagesScene } from './scenes/edit-cottages.scene';
import { AddNewCottageScene } from './scenes/add-new-cottage.scene';
import { AddNewAdministratorScene } from './scenes/add-new-administrator.scene';
import { ViewBookedScene } from './scenes/view-booked.scene';
import { AddNewCottageDescriptionScene } from './scenes/add-new-cottage-description.scene';
import { RemoveAdministratorScene } from './scenes/remove-administrator.scene';

const scenes = [
  AuthorizationScene,
  MainScene,
  BookARoomScene,
  AddNewCottagePhotosScene,
  AdministrationStartScene,
  EditAdministratorsScene,
  EditCottagesScene,
  AddNewCottageScene,
  AddNewAdministratorScene,
  ViewBookedScene,
  AddNewCottageDescriptionScene,
  RemoveAdministratorScene
];

const services = [
  TelegramUpdate,
  UserService,
  CottageService,
  FilesService
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Cottage.name, schema: cottageSchema }
    ]),
    HttpModule
  ],
  providers: [
    ...scenes,
    ...services
  ]
})
export class TelegramModule {
}
