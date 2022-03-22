import { ContextType } from '../types/context.type';

export const getMessageText = (ctx: ContextType) => {
  // @ts-ignore
  return ctx.message.text;
};
