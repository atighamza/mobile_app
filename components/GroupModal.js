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
import { FlatList, View, Image, Button, StyleSheet } from "react-native";
const database = firebase.database();

export default function GroupModal({ modalVisible, setModalVisible }) {
  const [profilsData, setProfilsData] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [groupName, setGroupName] = useState("");

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

  const createGroupeChat = async () => {
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
  useEffect(() => {
    console.log(selectedProfiles);
  }, [selectedProfiles]);
  return (
    <Modal
      visible={modalVisible}
      onDismiss={() => setModalVisible(false)}
      contentContainerStyle={{
        backgroundColor: "white",
        padding: 20,
        height: 400,
        marginHorizontal: 15,
      }}
    >
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

      <TextInput
        value={groupName}
        placeholder="group name ..."
        onChangeText={(text) => setGroupName(text)}
        mode="outlined"
        style={{ backgroundColor: "white", marginBottom: 10 }}
      />
      <Button title="create" onPress={() => createGroupeChat()} />
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
