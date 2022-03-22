import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD_NEW_ADMINISTRATOR_SCENE, EDIT_ADMINISTRATORS_SCENE } from '../constants/scenes.const';
import { UserService } from '../services/user.service';
import { ContextType } from '../types/context.type';
import { BACK_TO_PREVIOUS_MENU } from '../constants/buttons';
import { TYPE_AN_ADMIN_NUMBER } from '../constants/messages.const';
import { getMessageText } from '../utils/get-message-text';

@Scene(ADD_NEW_ADMINISTRATOR_SCENE)
export class AddNewAdministratorScene {
  constructor(private readonly userService: UserService) {
  }

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    await ctx.reply(TYPE_AN_ADMIN_NUMBER, {
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
    const text = getMessageText(ctx);
    if (text.trim()) {
      if (text === BACK_TO_PREVIOUS_MENU) {
        await ctx.scene.enter(EDIT_ADMINISTRATORS_SCENE);
      } else if (text.trim().length === 11) {
        const updatedUser = await this.userService.addAdmin(text);
        if (updatedUser) {
          console.log(updatedUser);
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
