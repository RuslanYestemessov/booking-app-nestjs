import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  ADD_NEW_COTTAGE_DESCRIPTION_SCENE,
  ADD_NEW_COTTAGE_PHOTOS_SCENE,
  ADD_NEW_COTTAGE_SCENE,
  EDIT_COTTAGES_SCENE
} from '../constants/scenes.const';
import {
  ADD_NEW_COTTAGE_DESCRIPTION,
  ADD_NEW_COTTAGE_PHOTOS,
  SELECT_AN_ACTION
} from '../constants/messages.const';
import { CottageService } from '../services/cottage.service';
import { ContextType } from '../types/context.type';
import {
  ADD_NEW_COTTAGE_DESCRIPTION_KEYBOARD,
  ADD_NEW_COTTAGE_PHOTOS_KEYBOARD, BACK_TO_PREVIOUS_MENU,
  SAVE_MESSAGE
} from '../constants/buttons';
import { getMessageText } from '../utils/get-message-text';

@Scene(ADD_NEW_COTTAGE_SCENE)
export class AddNewCottageScene {
  constructor(private readonly cottageService: CottageService) {
  }

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(SELECT_AN_ACTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: ADD_NEW_COTTAGE_DESCRIPTION_KEYBOARD }],
          [{ text: ADD_NEW_COTTAGE_PHOTOS_KEYBOARD }],
          [{ text: SAVE_MESSAGE }],
          [{ text: BACK_TO_PREVIOUS_MENU }]
        ]
      }
    });
  }

  @On('text')
  async addCottage(@Ctx() ctx: ContextType) {
    const text: string = getMessageText(ctx);
    switch (text) {
      case ADD_NEW_COTTAGE_DESCRIPTION_KEYBOARD:
        await ctx.scene.enter(ADD_NEW_COTTAGE_DESCRIPTION_SCENE, { ...ctx.scene.state });
        break;

      case ADD_NEW_COTTAGE_PHOTOS_KEYBOARD:
        await ctx.scene.enter(ADD_NEW_COTTAGE_PHOTOS_SCENE, { ...ctx.scene.state });
        break;

      case SAVE_MESSAGE:
        // @ts-ignore
        const { description, photos } = ctx.scene.state;
        if (description && photos) {
          await this.cottageService.addCottage({ description, photos });
          await ctx.reply('Сохранено!');
          await ctx.scene.reenter();
        }
        if (!description) {
          await ctx.reply(ADD_NEW_COTTAGE_DESCRIPTION);
        }
        if (!photos) {
          await ctx.reply(ADD_NEW_COTTAGE_PHOTOS);
        }
        break;

      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(EDIT_COTTAGES_SCENE);
        break;

      default:
        await ctx.reply(SELECT_AN_ACTION);
        break;
    }
  }
}
