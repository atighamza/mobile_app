import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function ProfilItem({
  firstName,
  lastName,
  num,
  url,
  id,
  setClickedProfile,
  setIsVisible,
  navigate,
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          //setClickedProfile({ firstName, lastName, num, url, id });
          //setIsVisible(true);
          navigate.navigate("chat", {
            clickedProfile: { secondId: id, firstName, lastName, url },
          });
        }}
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
            marginVertical: 15,
            borderRadius: 50,
          }}
        />
        <Text>{firstName}</Text>
        <Text>{lastName}</Text>
        <Text>{num}</Text>
      </TouchableOpacity>
    </View>
  );
}
