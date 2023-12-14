import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  MaterialIcons,
  Fontisto,
  AntDesign,
  Foundation,
} from "@expo/vector-icons";
export default function ChatInformations({ route, navigation }) {
  const { groupName, url, groupId } = route.params;
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
      <View style={{ marginLeft: 20 }}>
        <View>
          <TouchableOpacity
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: 25,
              marginVertical: 20,
            }}
            onPress={() => {
              navigation.navigate("groupImages", { groupId, url, groupName });
            }}
          >
            <MaterialIcons name="perm-media" size={40} color="black" />

            <Text style={{ fontSize: 25, marginBottom: 10 }}>
              See All images{" "}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: 25,
            }}
            onPress={() => {
              navigation.navigate("groupMembers", { groupId, url, groupName });
            }}
          >
            <Fontisto name="persons" size={40} color="black" />
            <Text style={{ fontSize: 25, marginBottom: 10 }}>
              See All members{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
