import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  ADMINISTRATION_START_SCENE,
  BOOK_A_ROOM_SCENE,
  MAIN_SCENE,
  VIEW_BOOKED_SCENE
} from '../constants/scenes.const';
import { ContextType } from '../types/context.type';
import { SELECT_AN_ACTION } from '../constants/messages.const';
import { ADMINISTRATION, BOOK_A_ROOM, RELOAD, VIEW_BOOKED } from '../constants/buttons';
import { UserService } from '../services/user.service';
import { getMessageText } from '../utils/get-message-text';
import { getUserId } from '../utils/get-user-id';

@Scene(MAIN_SCENE)
export class MainScene {
  constructor(private userService: UserService) {
  }

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    const user = await this.userService.getOneByTelegramId(getUserId(ctx));
    if (user.role === 'user') {
      await ctx.reply(SELECT_AN_ACTION, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: BOOK_A_ROOM }],
            [{ text: VIEW_BOOKED }],
            [{ text: RELOAD }]
          ]
        }
      });
    } else if (user.role === 'admin') {
      await ctx.reply(SELECT_AN_ACTION, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [{ text: BOOK_A_ROOM }],
            [{ text: VIEW_BOOKED }],
            [{ text: RELOAD }],
            [{ text: ADMINISTRATION }]
          ]
        }
      });
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const text = getMessageText(ctx);
    switch (text) {
      case BOOK_A_ROOM:
        await ctx.scene.enter(BOOK_A_ROOM_SCENE);
        break;
      case VIEW_BOOKED:
        await ctx.scene.enter(VIEW_BOOKED_SCENE);
        break;
      case RELOAD:
        await ctx.scene.reenter();
        break;
      case ADMINISTRATION:
        await ctx.scene.enter(ADMINISTRATION_START_SCENE, ctx.scene.state);
        break;
      default:
        await ctx.reply(SELECT_AN_ACTION);
        break;
    }
  }
}
