import { View, Text, FlatList } from "react-native";
import React from "react";
const data = [];
export default function ListProfils() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 30 }}>List profils</Text>
      <FlatList
        style={{
          width: "95%",
          marginBottom: 20,
          height: "80%",
          backgroundColor: "#0003",
          flexGrow: 0,
        }}
        data={data}
        renderItem={() => {}}
      />
    </View>
  );
}
