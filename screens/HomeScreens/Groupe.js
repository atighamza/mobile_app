import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { PaperProvider, Portal } from "react-native-paper";
import React, { useEffect, useState } from "react";
import GroupModal from "../../components/GroupModal";
import GroupItem from "./GroupItem";
import firebase from "../../config";
import useAuth from "../../hooks/useAuth";
const database = firebase.database();
export default function Groupe({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [groupsData, setGroupsData] = useState([]);
  const [currentUserID, setCurrentUserID] = useAuth();
  const ref_group = database.ref().child("groupChats");
  useEffect(() => {
    const fetchGroups = async () => {
      ref_group.on("value", (snapshot) => {
        const groups = [];
        snapshot.forEach((group) => {
          const membersArray = Object.keys(group.val().members);
          if (membersArray.includes(currentUserID)) {
            groups.push({ ...group.val(), groupId: group.key });
          }
        });
        setGroupsData(groups);
      });
    };
    fetchGroups();
  }, [modalVisible, currentUserID]);

  return (
    <PaperProvider>
      <Portal>
        {modalVisible && (
          <GroupModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        )}
      </Portal>

      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 20,
        }}
      >
        <Text style={{ fontSize: 30 }}>Groups List</Text>
        <FlatList
          style={{
            width: "95%",
            marginBottom: 20,
            height: "80%",

            flexGrow: 0,
          }}
          data={groupsData}
          keyExtractor={(item) => item.groupId}
          renderItem={({ item }) => {
            return (
              <GroupItem
                groupName={item.groupName}
                id={item.groupId}
                url={item.groupImage}
                navigate={navigation}
              />
            );
          }}
        />
      </View>
      <Button title="create group" onPress={() => setModalVisible(true)} />
    </PaperProvider>
  );
}
