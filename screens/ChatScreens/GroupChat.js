import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import useAuth from "../../hooks/useAuth";
import firebase from "../../config";
const database = firebase.database();

export default function GroupChat({ navigation, route }) {
  const { groupName, groupId } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUserID, setCurrentUserID] = useAuth();
  const ref_group = database.ref().child("groupChats").child(groupId);
  const ref_group_chat = ref_group.child("messages");

  const getProfilFullName = async (senderId) => {
    const ref_profil = database.ref().child("profile");
    let fullName = "";
    ref_profil.on("value", (snapshot) => {
      snapshot.forEach((profile) => {
        if (profile.val().id == senderId) {
          console.log("nom ", profile.val().nom);
          console.log("prenom ", profile.val().prenom);
          fullName = profile.val().nom + " " + profile.val().prenom;
        }
        console.log("full name : ", fullName);
      });
    });
    return fullName;
  };

  const sendMessage = async () => {
    const key = ref_group.push().key;
    await ref_group_chat.child("message" + key).set({
      sender: currentUserID,
      date: new Date().toISOString(),
      msg: message,
    });
    console.log("message sent");
  };

  useEffect(() => {
    const fetchMessages = async () => {
      ref_group_chat.on("child_added", async (snapshot) => {
        //console.log("message", snapshot.val());
        let senderName;
        if (snapshot.val().sender == currentUserID) {
          senderName = "Me";
        } else {
          senderName = await getProfilFullName(snapshot.val().sender);
        }
        const newMessage = { ...snapshot.val(), key: snapshot.key, senderName };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        // Add notification logic here
      });
    };
    // Notifications.requestPermissionsAsync();
    fetchMessages();
    getProfilFullName("13456");

    console.log("id chat :", currentUserID);
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

        <Text>{groupName}</Text>
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
            <Text style={styles.messageAuthor}>{item.senderName}</Text>
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
