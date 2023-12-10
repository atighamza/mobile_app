import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { PaperProvider, Portal } from "react-native-paper";
import React, { useEffect, useState } from "react";
import GroupModal from "../../components/GroupModal";

import firebase from "../../config";
import useAuth from "../../hooks/useAuth";
const database = firebase.database();
export default function Groupe({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [groupsData, setGroupsData] = useState([]);
  const [currentUserID, setCurrentUserID] = useAuth();
  useEffect(() => {
    const fetchGroups = async () => {
      database.ref("groupChats").on("child_added", (group) => {
        const membersArray = Object.keys(group.val().members);
        membersArray.forEach((id) => {
          if (id == currentUserID) {
            setGroupsData((prevGroups) => [
              ...prevGroups,
              { ...group.val(), groupId: group.key },
            ]);
          }
        });
      });
    };
    fetchGroups();
  }, [modalVisible]);

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
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("groupChat", {
                    groupId: item.groupId,
                    groupName: item.groupName,
                  })
                }
              >
                <Text>{item.groupName}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <Button title="create group" onPress={() => setModalVisible(true)} />
    </PaperProvider>
  );
}
