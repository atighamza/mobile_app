import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function GroupItem({ groupName, url, id, navigate }) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.log(id);
          navigate.navigate("groupChat", {
            groupName,
            groupId: id,
            url,
          });
        }}
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: 25,
        }}
      >
        <Image
          source={{ uri: url }}
          style={{
            width: 70,
            height: 70,
            marginVertical: 15,
            borderRadius: 50,
          }}
        />
        <Text style={{ fontSize: 18, marginBottom: 10 }}>{groupName}</Text>
      </TouchableOpacity>
    </View>
  );
}
