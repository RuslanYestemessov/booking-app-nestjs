import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD_NEW_COTTAGE_GUESTS_SCENE, ADD_NEW_COTTAGE_SCENE } from '../constants/scenes.const';
import { ContextType } from '../types/context.type';
import { ADD_NEW_COTTAGE_MAX_GUESTS } from '../constants/messages.const';
import { BACK_TO_PREVIOUS_MENU, SAVE_MESSAGE } from '../constants/buttons';
import { getMessageText } from '../utils/get-message-text';

@Scene(ADD_NEW_COTTAGE_GUESTS_SCENE)
export class AddNewCottageMaxGuestsScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(ADD_NEW_COTTAGE_MAX_GUESTS, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: SAVE_MESSAGE }],
          [{ text: BACK_TO_PREVIOUS_MENU }]
        ]
      }
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const text = getMessageText(ctx);
    if (!isNaN(Number(text))) {
      await ctx.scene.enter(ADD_NEW_COTTAGE_SCENE, { ...ctx.scene.state, guests: Number(text) });
      return;
    }
    switch (text) {
      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(ADD_NEW_COTTAGE_SCENE, { ...ctx.scene.state });
        break;
      default:
        await ctx.reply(ADD_NEW_COTTAGE_MAX_GUESTS, {
          reply_markup: {
            resize_keyboard: true,
            keyboard: [
              [{ text: SAVE_MESSAGE }],
              [{ text: BACK_TO_PREVIOUS_MENU }]
            ]
          }
        });
    }
  }
}
