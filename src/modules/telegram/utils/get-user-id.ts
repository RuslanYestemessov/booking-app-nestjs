export const getUserId = (context): number => {
  if ('callback_query' in context.update) {
    return context.update.callback_query.from.id;
  }

  if ('message' in context.update) {
    return context.update.message.from.id;
  }

  if ('my_chat_member' in context.update) {
    return context.update.my_chat_member.from.id;
  }

  return -1;
};
