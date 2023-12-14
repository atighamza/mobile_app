import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  MaterialIcons,
  Fontisto,
  AntDesign,
  Foundation,
} from "@expo/vector-icons";
import firebase from "../config";
const database = firebase.database();

export default function GroupMembers({ route }) {
  const { groupId, url, groupName } = route.params;

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const ref_group = database.ref().child("groupChats").child(groupId);
    const ref_profils = database.ref().child("profile");
    const fetchGroupMembers = async () => {
      let membersData = [];
      ref_group.child("members").on("value", (snapshot) => {
        membersData = Object.keys(snapshot.val());
      });
      ref_profils.on("value", (snapshot) => {
        snapshot.forEach((profil) => {
          if (membersData.includes(profil.val().id)) {
            setMembers((prevMembers) => [
              ...prevMembers,
              {
                image: profil.val().url,
                name: profil.val().nom + profil.val().prenom,
              },
            ]);
          }
        });
      });
    };

    fetchGroupMembers();
  }, []);
  useEffect(() => {
    console.log(members);
  }, [members]);
  return (
    <View>
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
          <AntDesign name="arrowleft" size={24} color="black" />
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
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          marginVertical: 10,
        }}
      ></View>

      <View>
        <FlatList
          style={{
            width: "95%",
            marginBottom: 20,
            marginLeft: 15,
            height: "80%",

            flexGrow: 0,
          }}
          data={members}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 25,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 70,
                    height: 70,
                    marginVertical: 15,
                    borderRadius: 50,
                  }}
                />
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                  {item.name}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
