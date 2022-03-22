import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { BOOK_A_ROOM_SCENE, MAIN_SCENE } from '../constants/scenes.const';
import { ContextType } from '../types/context.type';
import { CottageService } from '../services/cottage.service';
import { BACK_TO_PREVIOUS_MENU, SELECT_AN_COTTAGE } from '../constants/buttons';

@Scene(BOOK_A_ROOM_SCENE)
export class BookARoomScene {
  constructor(private cottageService: CottageService) {
  }

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: ContextType) {
    const cottages = await this.cottageService.getFreeCottages();
    if (cottages.length) {
      for (const cottage of cottages) {
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
      await ctx.reply('Выберите коттедж из доступных', {
        reply_markup: {
          keyboard: [
            [{ text: BACK_TO_PREVIOUS_MENU }]
          ],
          resize_keyboard: true
        }
      });
    } else {
      await ctx.reply('Нет доступных коттеджей, попробуйте позднее');
      await ctx.scene.enter(MAIN_SCENE, ctx.scene.state);
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    // @ts-ignore
    const text = ctx.message.text;
    switch (text) {
      case BACK_TO_PREVIOUS_MENU:
        await ctx.scene.enter(MAIN_SCENE);
        break;
      default:
        await ctx.reply('Неизвестная команда');
        break;
    }
  }

  @On('callback_query')
  async selectCottage(@Ctx() ctx: ContextType) {
    // @ts-ignore
    const callbackData = ctx.callbackQuery.data;
    const cottage = await this.cottageService.getOneById(callbackData);
    await this.cottageService.updateCottage(cottage.id, {
      photos: cottage.photos,
      description: cottage.description,
      bookedByUser: ctx.from.id,
      bookingExpired: Date.now() + (10 * 60 * 1000)
    });
    await ctx.reply(`Вы выбрали коттедж: ${cottage.id}`);
    await ctx.scene.enter(MAIN_SCENE);
  }
}
