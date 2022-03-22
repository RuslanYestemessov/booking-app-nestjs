import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { EDIT_ADMINISTRATORS_SCENE, REMOVE_ADMINISTRATOR_SCENE } from '../constants/scenes.const';
import { ContextType } from '../types/context.type';
import { TYPE_AN_ADMIN_NUMBER } from '../constants/messages.const';
import { BACK_TO_PREVIOUS_MENU } from '../constants/buttons';
import { getMessageText } from '../utils/get-message-text';
import { UserService } from '../services/user.service';

@Scene(REMOVE_ADMINISTRATOR_SCENE)
export class RemoveAdministratorScene {
  constructor(private userService: UserService) {
  }
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(TYPE_AN_ADMIN_NUMBER, {
      reply_markup: {
        keyboard: [
          [{ text: BACK_TO_PREVIOUS_MENU }]
        ]
      }
    });
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const text = getMessageText(ctx);
    if (text.trim()) {
      if (text === BACK_TO_PREVIOUS_MENU) {
        await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
      } else if (text.trim().length === 11) {
        const removedUser = await this.userService.removeAdmin(text);
        if (removedUser) {
          console.log(removedUser);
          await ctx.reply(`Пользователь с номером: ${text} успешно добавлен`);
          await ctx.reply('Добавьте администраторов, или нажмите кнопку \'Назад\' для возврата в предыдущее меню', {
            reply_markup: {
              resize_keyboard: true,
              keyboard: [
                [{ text: BACK_TO_PREVIOUS_MENU }]
              ]
            }
          });
        } else {
          await ctx.reply(`Пользователь с номером ${text} не найден`);
          await ctx.reply('Добавьте администраторов, или нажмите кнопку \'Назад\' для возврата в предыдущее меню');
        }
      } else {
        await ctx.reply(TYPE_AN_ADMIN_NUMBER);
      }
    } else {
      await ctx.reply(TYPE_AN_ADMIN_NUMBER);
    }
  }
}
