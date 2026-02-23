import { definePlugin } from "@vendetta";
import { React, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { FormSection, FormInput, FormDivider, FormRow } = Forms;
const { ScrollView, StyleSheet, Alert } = ReactNative;

const MessageActions = findByProps("sendMessage", "receiveMessage", "receiveMessageUpdate");
const ChannelStore = findByStoreName("ChannelStore");
const UserStore = findByStoreName("UserStore");
const MessageStore = findByStoreName("MessageStore");

const STORAGE_KEYS = {
  USER_ID: "fakeMessage_userId",
  MESSAGE_CONTENT: "fakeMessage_content",
};

function SettingsPanel() {
  const [userId, setUserId] = React.useState(storage.getString(STORAGE_KEYS.USER_ID) || "");
  const [messageContent, setMessageContent] = React.useState(
    storage.getString(STORAGE_KEYS.MESSAGE_CONTENT) || "",
  );

  const handleSendFakeMessage = async () => {
    if (!userId.trim()) {
      Alert.alert("Error", "Please enter a user ID.");
      return;
    }

    if (!messageContent.trim()) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }

    const channelId = ChannelStore.getChannelId();
    if (!channelId) {
      Alert.alert("Error", "No channel selected. Open the DM you want to fake a message in.");
      return;
    }

    const channel = ChannelStore.getChannel(channelId);
    if (!channel || (channel.type !== 1 && channel.type !== 3)) {
      Alert.alert("Error", "This plugin only works in DMs.");
      return;
    }

    let targetUser = UserStore.getUser(userId);
    if (!targetUser) {
      try {
        const UserActions = findByProps("fetchProfile", "getUser");
        if (UserActions && UserActions.fetchProfile) {
          await UserActions.fetchProfile(userId);
          targetUser = UserStore.getUser(userId);
        }
      } catch (e) {
        console.log("Could not fetch user profile:", e);
      }

      if (!targetUser) {
        Alert.alert(
          "Error",
          "User not found. Check the ID and make sure you share a server / DM.",
        );
        return;
      }
    }

    try {
      const messageId = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

      const fakeMessage = {
        id: messageId,
        channel_id: channelId,
        author: {
          id: userId,
          username: targetUser.username,
          discriminator: targetUser.discriminator || "0",
          avatar: targetUser.avatar,
          bot: targetUser.bot || false,
          public_flags: targetUser.publicFlags || 0,
          avatar_decoration: targetUser.avatarDecoration ?? null,
        },
        content: messageContent,
        timestamp: new Date().toISOString(),
        edited_timestamp: null,
        tts: false,
        mention_everyone: false,
        mentions: [],
        mention_roles: [],
        mention_channels: [],
        attachments: [],
        embeds: [],
        reactions: [],
        pinned: false,
        type: 0,
        flags: 0,
        referenced_message: null,
        message_reference: null,
      };

      let success = false;

      if (MessageActions && MessageActions.receiveMessage) {
        try {
          MessageActions.receiveMessage(channelId, fakeMessage);
          success = true;
        } catch (e) {
          console.log("receiveMessage failed:", e);
        }
      }

      if (!success && MessageStore && MessageStore.addMessage) {
        try {
          MessageStore.addMessage(channelId, fakeMessage);
          success = true;
        } catch (e) {
          console.log("MessageStore.addMessage failed:", e);
        }
      }

      if (!success) {
        try {
          const FluxDispatcher = findByProps("dispatch", "subscribe");
          if (FluxDispatcher && FluxDispatcher.dispatch) {
            FluxDispatcher.dispatch({ type: "MESSAGE_CREATE", message: fakeMessage });
            success = true;
          }
        } catch (e) {
          console.log("FluxDispatcher dispatch failed:", e);
        }
      }

      if (success) {
        Alert.alert("Success", "Fake message injected into this DM.");
      } else {
        Alert.alert(
          "Error",
          "Could not inject fake message. Your Kettu/Vendetta version may differ.",
        );
      }
    } catch (err) {
      console.error("Error sending fake message:", err);
      Alert.alert(
        "Error",
        `Failed to send fake message: ${err && err.message ? err.message : "Unknown error"}`,
      );
    }
  };

  return React.createElement(
    ScrollView,
    { style: styles.container },
    React.createElement(
      FormSection,
      { title: "Fake Message Settings" },
      React.createElement(FormInput, {
        title: "User ID",
        value: userId,
        onChangeText: (text) => {
          setUserId(text);
          storage.set(STORAGE_KEYS.USER_ID, text);
        },
        placeholder: "Paste the user ID to impersonate",
        keyboardType: "numeric",
      }),
      React.createElement(FormDivider, null),
      React.createElement(FormInput, {
        title: "Message Content",
        value: messageContent,
        onChangeText: (text) => {
          setMessageContent(text);
          storage.set(STORAGE_KEYS.MESSAGE_CONTENT, text);
        },
        placeholder: "Type the fake message content",
        multiline: true,
        numberOfLines: 4,
      }),
      React.createElement(FormDivider, null),
      React.createElement(FormRow, {
        label: "Send Fake Message",
        subLabel: "Inject a fake message in the currently open DM",
        onPress: handleSendFakeMessage,
      }),
    ),
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2f3136",
  },
});

export default definePlugin({
  name: "Fake DM Message",
  description: "Inject a fake message in the current DM from any user ID.",
  authors: [{ id: "1186400819193597962", name: "gabe" }],
  version: "1.0.0",
  settings: SettingsPanel,
});
