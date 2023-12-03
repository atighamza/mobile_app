import { View, Text, Image } from "react-native";
import React from "react";

export default function ProfilItem({ firstName, lastName, num, url }) {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 30,
      }}
    >
      <Image
        source={{ uri: url }}
        style={{
          width: 50,
          height: 50,
          marginVertical: 20,
          borderRadius: 50,
        }}
      />
      <Text>{firstName}</Text>
      <Text>{lastName}</Text>
      <Text>{num}</Text>
    </View>
  );
}
