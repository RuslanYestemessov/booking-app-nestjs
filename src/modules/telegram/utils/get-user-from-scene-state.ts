import { ContextType } from '../types/context.type';

export const getUserFromSceneState = (ctx: ContextType) => {
  // @ts-ignore
  return ctx.scene.state.user;
};
