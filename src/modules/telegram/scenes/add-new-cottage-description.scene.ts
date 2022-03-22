import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD_NEW_COTTAGE_DESCRIPTION } from '../constants/messages.const';
import { ADD_NEW_COTTAGE_DESCRIPTION_SCENE, ADD_NEW_COTTAGE_SCENE } from '../constants/scenes.const';
import { ContextType } from '../types/context.type';
import { BACK_TO_PREVIOUS_MENU } from '../constants/buttons';
import { getMessageText } from '../utils/get-message-text';

@Scene(ADD_NEW_COTTAGE_DESCRIPTION_SCENE)
export class AddNewCottageDescriptionScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(ADD_NEW_COTTAGE_DESCRIPTION, {
      reply_markup: {
        remove_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [{ text: BACK_TO_PREVIOUS_MENU }]
        ]
      }
    });
  }

  @On('text')
  async addNewCottageDescription(@Ctx() ctx: ContextType) {
    const description = getMessageText(ctx);
    if (description === BACK_TO_PREVIOUS_MENU) {
      await ctx.scene.enter(ADD_NEW_COTTAGE_SCENE);
    } else if (description.trim()) {
      await ctx.scene.enter(ADD_NEW_COTTAGE_SCENE, { ...ctx.scene.state, description });
    } else {
      await ctx.reply(ADD_NEW_COTTAGE_DESCRIPTION);
    }
  }
}
