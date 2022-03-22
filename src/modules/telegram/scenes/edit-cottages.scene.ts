import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD_NEW_COTTAGE_SCENE, ADMINISTRATION_START_SCENE, EDIT_COTTAGES_SCENE } from '../constants/scenes.const';
import {
  CHOOSE_ONE_OF_THE_SUGGESTED_ACTIONS,
  SELECT_AN_ACTION
} from '../constants/messages.const';
import { ADD_NEW_COTTAGE, BACK_TO_PREVIOUS_MENU } from '../constants/buttons';
import { ContextType } from '../types/context.type';
import { getMessageText } from '../utils/get-message-text';

@Scene(EDIT_COTTAGES_SCENE)
export class EditCottagesScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(SELECT_AN_ACTION, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: ADD_NEW_COTTAGE }],
          [{ text: BACK_TO_PREVIOUS_MENU }]
        ]
      }
    });
  }

  @On('text')
  async editCottageHandler(@Ctx() ctx: ContextType) {
    const text = getMessageText(ctx);
    switch (text) {
      case ADD_NEW_COTTAGE:
        await ctx.scene.enter(ADD_NEW_COTTAGE_SCENE);
        break;

      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(ADMINISTRATION_START_SCENE);
        break;

      default:
        return CHOOSE_ONE_OF_THE_SUGGESTED_ACTIONS;
    }
  }
}
