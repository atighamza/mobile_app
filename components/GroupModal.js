import React, { useEffect, useState } from "react";
import {
  Modal,
  Portal,
  Text,
  PaperProvider,
  Checkbox,
  TextInput,
} from "react-native-paper";
import firebase from "../config";
import useAuth from "../hooks/useAuth";
import {
  FlatList,
  View,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { pickImage, imageToBlob } from "../pickImage";
const database = firebase.database();
const storage = firebase.storage();

export default function GroupModal({ modalVisible, setModalVisible }) {
  const [profilsData, setProfilsData] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentUserID, setCurrentUserID] = useAuth();

  const toggleProfileSelection = (profileId) => {
    const isSelected = selectedProfiles.includes(profileId);

    if (isSelected) {
      setSelectedProfiles((prevSelected) =>
        prevSelected.filter((id) => id !== profileId)
      );
    } else {
      setSelectedProfiles((prevSelected) => [...prevSelected, profileId]);
    }
  };

  const upload_Image = async () => {
    const key = database.ref("groupChats").push().key;
    console.log("blob : ", imageUrl);
    const blob = await imageToBlob(imageUrl);
    const ref = storage.ref("images").child(`image${key}.jpg`);
    await ref.put(blob);
    let url = await ref.getDownloadURL();
    console.log("url : ", url);
    return url;
  };

  const createGroupeChat = async () => {
    setIsLoading(true);
    // Create a group chat in Firebase and add selected profiles
    const groupChatRef = database.ref("groupChats").push();
    const groupChatId = groupChatRef.key;

    selectedProfiles.forEach((profileId) => {
      // Add each selected profile to the group chat
      groupChatRef.child("members").child(profileId).set(true);
    });

    // Add the current user to the group chat
    await groupChatRef.child("members").child(currentUserID).set(true);

    //Add group name
    groupChatRef.child("groupName").set(groupName);

    //Add group image
    let image = await upload_Image();
    await groupChatRef.child("groupImage").set(image);
    setIsLoading(false);
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchProfils = async () => {
      database.ref("profile").on("value", (snapshot) => {
        let data = [];
        snapshot.forEach((profil) => {
          if (profil.val().id != currentUserID) {
            data.push(profil.val());
          }
        });
        setProfilsData(data);
        console.log("data group : ", data);
      });
    };
    fetchProfils();
  }, []);

  return (
    <Modal
      visible={modalVisible}
      onDismiss={() => {
        if (!isLoading) {
          setModalVisible(false);
        }
      }}
      contentContainerStyle={{
        backgroundColor: "white",
        padding: 20,
        height: 400,
        marginHorizontal: 15,
      }}
    >
      <TextInput
        value={groupName}
        placeholder="group name ..."
        onChangeText={(text) => setGroupName(text)}
        mode="outlined"
        style={{ backgroundColor: "white", marginBottom: 10 }}
      />
      <FlatList
        data={profilsData}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: item.url }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginEnd: 10,
              }}
            />
            <Text>{`${item.nom} ${item.prenom}`}</Text>
            <Checkbox
              style={{ alignSelf: "flex-end" }}
              status={
                selectedProfiles.includes(item.id) ? "checked" : "unchecked"
              }
              onPress={() => toggleProfileSelection(item.id)}
            />
          </View>
        )}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginBottom: 30,
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            let uri = await pickImage();
            setImageUrl(uri);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 20 }}>Add image :</Text>
          <Entypo name="upload" size={24} color="black" />
        </TouchableOpacity>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={{ width: 70, height: 70 }} />
        )}
      </View>
      {isLoading ? (
        <Image
          source={require("../assets/loading.gif")}
          style={{ height: 24, width: 24 }}
        />
      ) : (
        <Button title="create" onPress={() => createGroupeChat()} />
      )}
    </Modal>
  );
}
const styles = StyleSheet.create({
  text_input: {
    width: "60%",
    borderRadius: 10,
    paddingVertical: 10,
    borderColor: "black",
    color: "white",
    textAlign: "center",
  },
});
