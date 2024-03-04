import { createSlice } from "@reduxjs/toolkit";
/*
chats = [
    {
        messages: [],
        theOtherUser: {},
    },
    {
        messages: [],
        theOtherUser: {},
    }
]
*/
const initialState = {
  chats: [],
  count: 0,
  unRead: 0,
};

function setNewMessage(state, action) {
  let chatFound = false;

  let modifiedChats = state.chats.map((chat) => {
    const newChat = {
      ...chat,
      lastText: { ...chat.lastText },
      theOtherUser: { ...chat.theOtherUser },
      messages: [...chat.messages],
    };

    if (chat.theOtherUser._id === action.payload.theOtherUser._id) {
      chatFound = true;

      if (action.payload.notifType === "NEW") {
        const item = action.payload.item;

        newChat.lastText = {
          _id: item._id,
          text: item.text,
          createdAt: item.createdAt,
        };
        newChat.messages.push(item);
      }
    }

    return newChat;
  });

  if (chatFound) {
    modifiedChats.sort((a, b) => {
      const aTime = new Date(a?.lastText?.createdAt);
      const bTime = new Date(b?.lastText?.createdAt);

      if (aTime > bTime) {
        return -1;
      } else if (bTime > aTime) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  if (!chatFound && action.payload.notifType === "NEW") {
    modifiedChats.push({
      theOtherUser: action.payload.theOtherUser,
      messages: [action.payload.item],
    });
  }

  state.chats = modifiedChats;
}

function setMessages(state, action) {
  state.chats = [...action.payload].sort((a, b) => {
    const aTime = new Date(a?.lastText?.createdAt);
    const bTime = new Date(b?.lastText?.createdAt);

    if (aTime > bTime) {
      return -1;
    } else if (bTime > aTime) {
      return 1;
    } else {
      return 0;
    }
  });
}

function updateUnSeenCount(state, action) {
  state.chats = state.chats.map((item) => {
    if (item._id === action.payload._id) {
      return {
        ...item,
        unseenCount: action.payload.count,
      };
    } else {
      return item;
    }
  });
}

function clearMessages() {
  // this should be an explicit return
  // https://redux-toolkit.js.org/usage/immer-reducers#resetting-and-replacing-state
  return initialState;
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setNewMessage,
    setMessages,
    clearMessages,
    updateUnSeenCount,
  },
});

export const {
  setMessages: setMessageAction,
  setNewMessage: setNewMessageAction,
  clearMessages: clearMessagesAction,
  updateUnSeenCount: updateUnSeenCountAction,
} = messageSlice.actions;

export default messageSlice.reducer;
