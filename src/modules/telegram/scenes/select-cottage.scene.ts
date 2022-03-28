import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { MAIN_SCENE, SELECT_COTTAGE_BY_GUESTS_NUMBER_SCENE, SELECT_COTTAGE_SCENE } from '../constants/scenes.const';
import { ContextType } from '../types/context.type';
import { SELECT_A_PERSON_NUMBER, UNKNOWN_COMMAND } from '../constants/messages.const';
import { getMessageText } from '../utils/get-message-text';
import { BACK_TO_PREVIOUS_MENU } from '../constants/buttons';

@Scene(SELECT_COTTAGE_SCENE)
export class SelectCottageScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(SELECT_A_PERSON_NUMBER, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: '2' }],
          [{ text: '3' }],
          [{ text: '4' }],
          [{ text: '6' }],
          [{ text: '10' }],
          [{ text: BACK_TO_PREVIOUS_MENU }]
        ]
      }
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const text = getMessageText(ctx);
    if (!isNaN(Number(text))) {
      await ctx.scene.enter(SELECT_COTTAGE_BY_GUESTS_NUMBER_SCENE, { guests: Number(text) });
      return;
    }
    switch (text) {
      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(MAIN_SCENE);
        break;

      default:
        await ctx.reply(UNKNOWN_COMMAND);
        break;
    }
  }
}
