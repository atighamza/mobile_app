import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  Button,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthProvider";
//import { Button } from "react-native-paper";
import firebase from "../../config";
import * as Notifications from "expo-notifications";
import { AntDesign } from "@expo/vector-icons";

const database = firebase.database();

export default function Chat(props) {
  const { secondId, firstName, lastName, url } =
    props.route.params.clickedProfile;
  const { currentUserID, setCurrentUserID } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const ref_chats = database.ref().child("chats");
  const chatid =
    currentUserID > secondId
      ? currentUserID + secondId
      : secondId + currentUserID;
  const ref_un_chat = ref_chats.child(chatid);
  const sendMessage = async () => {
    const key = ref_chats.push().key;
    await ref_un_chat.child("message" + key).set({
      sender: currentUserID,
      receiver: secondId,
      date: new Date().toISOString(),
      msg: message,
    });
    console.log("message sent");
  };

  useEffect(() => {
    const fetchMessages = async () => {
      ref_un_chat.on("child_added", (snapshot) => {
        const newMessage = { ...snapshot.val(), key: snapshot.key };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        // Add notification logic here
      });
    };
    Notifications.requestPermissionsAsync();
    fetchMessages();
    console.log("id chat :", currentUserID);
    console.log("clicked id  :", secondId);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
          marginTop: 50,
          marginStart: 5,
        }}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={() => props.navigation.navigate("home")}
        />

        <Image
          source={{ uri: url }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <Text>{firstName + " " + lastName}</Text>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          marginVertical: 10,
        }}
      ></View>

      <FlatList
        data={messages}
        style={{ height: 400 }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View
            style={
              item.sender == currentUserID
                ? styles.senderMessage
                : styles.receiverMessage
            }
          >
            <Text style={styles.messageAuthor}>
              {item.sender == currentUserID ? "Me" : `${firstName} ${lastName}`}
            </Text>
            <Text style={styles.messageText}>{item.msg}</Text>
            <Text>{new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  message: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
    alignSelf: "flex-end",
    marginEnd: 20,
  },
  senderMessage: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
    alignSelf: "flex-end",
    marginEnd: 20,
  },
  receiverMessage: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
    alignSelf: "flex-start",
    marginStart: 20,
  },
  messageAuthor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 5,
  },
});
