const TAG_KEY = "materialpinned";
const MENU_ID = "material-pin-toggle";

async function ensureTag() {
  const tags = await messenger.messages.tags.list();
  if (!tags.some(tag => tag.key === TAG_KEY)) {
    await messenger.messages.tags.create(TAG_KEY, "📌 Pinned", "#6750A4");
  }
}

async function allMessages(messageList) {
  if (!messageList) {
    return [];
  }
  const messages = [...messageList.messages];
  let id = messageList.id;
  while (id) {
    const page = await messenger.messages.continueList(id);
    messages.push(...page.messages);
    id = page.id;
  }
  return messages;
}

messenger.menus.create({
  id: MENU_ID,
  title: "📌 固定到顶部",
  contexts: ["message_list"]
});

messenger.menus.onShown.addListener(async info => {
  if (!info.contexts.includes("message_list")) {
    return;
  }
  const messages = await allMessages(info.selectedMessages);
  const pinned = messages.length > 0 && messages.every(message => message.tags.includes(TAG_KEY));
  await messenger.menus.update(MENU_ID, {
    title: pinned ? "取消固定" : "📌 固定到顶部",
    enabled: messages.length > 0
  });
  messenger.menus.refresh();
});

messenger.menus.onClicked.addListener(async info => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }
  try {
    const messages = await allMessages(info.selectedMessages);
    await toggleMessages(messages);
  } catch (error) {
    console.error("Material Pin could not update the selected messages", error);
  }
});

async function toggleMessages(messages) {
  if (!messages.length) {
    return;
  }
  const unpin = messages.every(message => message.tags.includes(TAG_KEY));
  for (const message of messages) {
    const tags = new Set(message.tags);
    if (unpin) {
      tags.delete(TAG_KEY);
    } else {
      tags.add(TAG_KEY);
    }
    await messenger.messages.update(message.id, { tags: [...tags] });
  }
  await messenger.MaterialPin.refreshAndSort();
}

messenger.messageDisplayAction.onClicked.addListener(async tab => {
  try {
    const messages = await allMessages(await messenger.messageDisplay.getDisplayedMessages(tab.id));
    await toggleMessages(messages);
    const pinned = messages.length > 0 && !messages.every(message => message.tags.includes(TAG_KEY));
    await messenger.messageDisplayAction.setTitle({
      tabId: tab.id,
      title: pinned ? "取消固定" : "固定到顶部"
    });
  } catch (error) {
    console.error("Material Pin could not update the displayed message", error);
  }
});

messenger.messageDisplay.onMessagesDisplayed.addListener(async (tab, list) => {
  const messages = await allMessages(list);
  const pinned = messages.length > 0 && messages.every(message => message.tags.includes(TAG_KEY));
  await messenger.messageDisplayAction.setTitle({
    tabId: tab.id,
    title: pinned ? "取消固定" : "固定到顶部"
  });
});

messenger.mailTabs.onDisplayedFolderChanged.addListener(async () => {
  // The view is available only after Thunderbird completes the folder switch.
  await messenger.MaterialPin.sortAll();
});

await ensureTag();
await messenger.MaterialPin.start();
await messenger.MaterialPin.sortAll();
