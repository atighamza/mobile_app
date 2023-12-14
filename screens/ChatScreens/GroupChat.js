import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { pickMessageImage, imageToBlob } from "../../pickImage";

import {
  AntDesign,
  Ionicons,
  FontAwesome,
  Foundation,
} from "@expo/vector-icons";
import useAuth from "../../hooks/useAuth";
import firebase from "../../config";
const database = firebase.database();
const storage = firebase.storage();

export default function GroupChat({ navigation, route }) {
  const { groupName, groupId, url } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    let image = null;
    if (imageUrl) {
      image = await upload_Image();
    }
    console.log("sending");
    const key = ref_group.push().key;
    await ref_group_chat.child("message" + key).set({
      sender: currentUserID,
      date: new Date().toISOString(),
      msg: message,
      image,
    });
    console.log("message sent");
    setMessage("");
    setImageUrl(null);
    setIsLoading(false);
  };

  //upload image
  const upload_Image = async () => {
    const key = ref_group_chat.push().key;
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
      ref_group_chat.on("child_added", async (snapshot) => {
        //check if the current user
        let senderName;
        if (snapshot.val().sender == currentUserID) {
          senderName = "Me";
        } else {
          senderName = await getProfilFullName(snapshot.val().sender);
        }

        //check if the current day so take only the time else keep the whole date

        const messageDate = new Date(snapshot.val().date);
        const today = new Date();
        let displayDate;
        if (
          messageDate.getDate() === today.getDate() &&
          messageDate.getMonth() === today.getMonth() &&
          messageDate.getFullYear() === today.getFullYear()
        ) {
          // If the message is from today, display only the time
          displayDate = messageDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else {
          // If the message is from a previous day, display the whole date
          displayDate = messageDate.toLocaleString();
        }

        const newMessage = {
          ...snapshot.val(),
          key: snapshot.key,
          senderName,
          displayDate,
        };

        setMessages((prevMessages) => {
          const sortedMessages = [...prevMessages, newMessage].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          return sortedMessages;
        });
      });
    };
    // Notifications.requestPermissionsAsync();
    fetchMessages();

    console.log("id chat :", currentUserID);
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: 10,
          marginTop: 50,
          marginStart: 5,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 10,
            gap: 10,
          }}
        >
          <AntDesign
            name="arrowleft"
            size={24}
            color="black"
            onPress={() => navigation.navigate("groupe")}
          />
          <Image
            source={{ uri: url }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
          />
          <Text>{groupName}</Text>
        </View>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() =>
            navigation.navigate("chatInformations", { groupName, url, groupId })
          }
        >
          <Foundation name="info" size={30} color="black" />
        </TouchableOpacity>
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
            <Text style={styles.messageAuthor}>{item.senderName}</Text>
            <Text style={styles.messageText}>{item.msg}</Text>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{ height: 100, width: 100 }}
              />
            )}
            <Text>{item.displayDate}</Text>
          </View>
        )}
      />
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
            onChangeText={(text) => setMessage(text)}
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
