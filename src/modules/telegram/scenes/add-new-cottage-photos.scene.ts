import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD_NEW_COTTAGE_PHOTOS_SCENE, ADD_NEW_COTTAGE_SCENE } from '../constants/scenes.const';
import { ADD_NEW_COTTAGE_PHOTOS } from '../constants/messages.const';
import { FilesService } from '../services/files.service';
import * as path from 'path';
import { ContextType } from '../types/context.type';
import { BACK_TO_PREVIOUS_MENU } from '../constants/buttons';

@Scene(ADD_NEW_COTTAGE_PHOTOS_SCENE)
export class AddNewCottagePhotosScene {
  constructor(private readonly fileService: FilesService) {
  }

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(ADD_NEW_COTTAGE_PHOTOS, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: BACK_TO_PREVIOUS_MENU }]
        ]
      }
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    // @ts-ignore
    const text = ctx.message.text;
    if (text === BACK_TO_PREVIOUS_MENU) {
      ctx.scene.enter(ADD_NEW_COTTAGE_SCENE, { ...ctx.scene.state });
    }
  }

  @On('photo')
  async addNewPhoto(@Ctx() ctx: ContextType) {
    // @ts-ignore
    const { file_id } = await ctx.message.photo[ctx.message.photo.length - 1];
    const fileUrl = String(await ctx.telegram.getFileLink(file_id));
    if (
      path.extname(fileUrl) === '.jpg'
      || path.extname(fileUrl) === '.png'
      || path.extname(fileUrl) === '.jpeg'
    ) {
      const fileName = path.basename(String(fileUrl));
      this.fileService.downloadFile(String(fileUrl), 'photos', fileName);
      // @ts-ignore
      const { photos } = ctx.scene.state;
      if (photos) {
        ctx.scene.state = { ...ctx.scene.state, photos: [...photos, fileName] };
      } else {
        ctx.scene.state = { ...ctx.scene.state, photos: [fileName] };
      }
    } else {
      return 'Отправьте фото в формате JPG/PNG';
    }
  }
}
