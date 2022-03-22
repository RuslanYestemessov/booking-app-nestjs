import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  ADMINISTRATION_START_SCENE,
  EDIT_ADMINISTRATORS_SCENE,
  EDIT_COTTAGES_SCENE, MAIN_SCENE
} from '../constants/scenes.const';
import {
  ADMIN_AUTHORIZATION_SUCCESSFULLY,
  CHOOSE_ONE_OF_THE_SUGGESTED_ACTIONS,
} from '../constants/messages.const';
import { ContextType } from '../types/context.type';
import { BACK_TO_MAIN_MENU, EDIT_ADMINISTRATORS, EDIT_COTTAGES } from '../constants/buttons';

@Scene(ADMINISTRATION_START_SCENE)
export class AdministrationStartScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(ADMIN_AUTHORIZATION_SUCCESSFULLY, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: EDIT_ADMINISTRATORS }],
          [{ text: EDIT_COTTAGES }],
          [{ text: BACK_TO_MAIN_MENU }]
        ]
      }
    });
  }

  @On('text')
  async handleText(@Ctx() ctx: ContextType) {
    // @ts-ignore
    const text = ctx.message.text;
    switch (text) {

      case EDIT_ADMINISTRATORS:
        await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
        break;

      case EDIT_COTTAGES:
        await ctx.scene.enter(EDIT_COTTAGES_SCENE);
        break;

      case BACK_TO_MAIN_MENU:
        await ctx.scene.enter(MAIN_SCENE);
        break;

      default:
        await ctx.reply(CHOOSE_ONE_OF_THE_SUGGESTED_ACTIONS);
    }
  }
}
