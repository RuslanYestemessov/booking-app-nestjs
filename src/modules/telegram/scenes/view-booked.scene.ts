import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { MAIN_SCENE, VIEW_BOOKED_SCENE } from '../constants/scenes.const';
import { ContextType } from '../types/context.type';
import { getUserId } from '../utils/get-user-id';
import { CottageService } from '../services/cottage.service';
import { BOOKED_COTTAGES_NOT_FOUND, SELECT_AN_ACTION } from '../constants/messages.const';
import { BACK_TO_MAIN_MENU, BACK_TO_PREVIOUS_MENU, SELECT_AN_COTTAGE } from '../constants/buttons';
import { getMessageText } from '../utils/get-message-text';

@Scene(VIEW_BOOKED_SCENE)
export class ViewBookedScene {
  constructor(private cottageService: CottageService) {
  }

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    const userId = getUserId(ctx);
    const bookedCottages = await this.cottageService.getBookedForUser(userId);
    if (bookedCottages.length) {
      for (const cottage of bookedCottages) {
        for (const photo of (await cottage).photos) {
          await ctx.replyWithPhoto({ source: `photos/${photo}` });
        }
        await ctx.reply(cottage.description, {
          reply_markup: {
            inline_keyboard: [
              [{ text: SELECT_AN_COTTAGE, callback_data: cottage.id }]
            ]
          }
        });
      }
    } else {
      await ctx.reply(BOOKED_COTTAGES_NOT_FOUND);
      await ctx.scene.enter(MAIN_SCENE);
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const text = getMessageText(ctx);
    switch (text) {
      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(MAIN_SCENE);
        break;
      case BACK_TO_MAIN_MENU:
        await ctx.scene.enter(MAIN_SCENE);
        break;
      default:
        await ctx.reply(SELECT_AN_ACTION, {
          reply_markup: {
            resize_keyboard: true,
            keyboard: [
              [{ text: BACK_TO_PREVIOUS_MENU }],
              [{ text: BACK_TO_MAIN_MENU }]
            ]
          }
        });
    }
  }

  @On('callback_query')
  async callBackQuery(@Ctx() ctx: ContextType) {

  }
}
