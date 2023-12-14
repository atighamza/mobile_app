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
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthProvider";
//import { Button } from "react-native-paper";
import firebase from "../../config";
import { pickMessageImage, imageToBlob } from "../../pickImage";

import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";

const database = firebase.database();
const storage = firebase.storage();

export default function Chat(props) {
  const { secondId, firstName, lastName, url } =
    props.route.params.clickedProfile;
  const { currentUserID, setCurrentUserID } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const ref_chats = database.ref().child("chats");
  const chatid =
    currentUserID > secondId
      ? currentUserID + secondId
      : secondId + currentUserID;
  const ref_un_chat = ref_chats.child(chatid);

  //send message function
  const sendMessage = async () => {
    await ref_un_chat.child("typing").set(false);

    let image = null;
    if (imageUrl) {
      image = await upload_Image();
    }
    console.log("sending");
    const key = ref_chats.push().key;
    await ref_un_chat.child("message" + key).set({
      sender: currentUserID,
      receiver: secondId,
      date: new Date().toISOString(),
      msg: message,
      image,
    });
    console.log("message sent");
    setMessage("");
    setImageUrl(null);
    setIsLoading(false);
    setIsTyping(false);
  };

  //upload image
  const upload_Image = async () => {
    const key = ref_chats.push().key;
    console.log("blob : ", imageUrl);
    const blob = await imageToBlob(imageUrl);
    const ref = storage.ref("images").child(`image${key}.jpg`);
    await ref.put(blob);
    let url = await ref.getDownloadURL();
    console.log("url : ", url);
    return url;
  };

  useEffect(() => {
    const fetchMessages = async () => {
      ref_un_chat.on("child_added", (snapshot) => {
        const newMessage = { ...snapshot.val(), key: snapshot.key };
        setMessages((prevMessages) => {
          const sortedMessages = [...prevMessages, newMessage].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          return sortedMessages;
        });
      });
    };
    fetchMessages();

    console.log("id chat :", currentUserID);
    console.log("clicked id  :", secondId);
  }, []);

  //check user is typing
  useEffect(() => {
    const typingRef = ref_un_chat.child("typing");

    const handleTyping = (snapshot) => {
      setIsTyping(snapshot.val());
    };

    // Listen for typing events
    typingRef.on("value", handleTyping);

    // Clean up the event listener
    return () => {
      typingRef.off("value", handleTyping);
    };
  }, [ref_un_chat]);
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
        inverted={true}
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
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{ height: 100, width: 100 }}
              />
            )}
            <Text>{new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
      />
      {isTyping && <Text>typing...</Text>}

      <View style={styles.container_bottom}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 2,
            position: "relative",
            alignSelf: "center",
          }}
        >
          {imageUrl && (
            <>
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                underlayColor="#fff"
                onPress={() => setImageUrl(null)}
              >
                <Text style={{ color: "white" }}>X</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingTop: 2,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              let uri = await pickMessageImage();
              setImageUrl(uri);
            }}
          >
            <FontAwesome
              name="image"
              size={24}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={(text) => {
              setIsTyping(true);
              setMessage(text);
            }}
          />
          {(message || imageUrl) && (
            <>
              {isLoading ? (
                <Image
                  source={require("../../assets/loading.gif")}
                  style={{ height: 24, width: 24 }}
                />
              ) : (
                <TouchableOpacity onPress={sendMessage}>
                  <Ionicons
                    name="send-sharp"
                    size={24}
                    color="black"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
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
  container_bottom: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  icon: {
    marginHorizontal: 7,
  },
  removeImageButton: {
    height: 20,
    width: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#ccc",
    position: "absolute",
    top: -5,
    right: -10,
  },
});
