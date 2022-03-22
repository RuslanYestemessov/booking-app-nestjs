import { Ctx, Start, Update } from 'nestjs-telegraf';
import { UserService } from './services/user.service';
import { AUTHORIZATION_SCENE, MAIN_SCENE } from './constants/scenes.const';
import { ContextType } from './types/context.type';

@Update()
export class TelegramUpdate {
  constructor(private userService: UserService) {
  }

  @Start()
  async onStart(@Ctx() ctx: ContextType) {
    const user = await this.userService.getOneByTelegramId(ctx.message.from.id);
    if (user) {
      await ctx.scene.enter(MAIN_SCENE);
    } else {
      await ctx.scene.enter(AUTHORIZATION_SCENE);
    }
  }
}
