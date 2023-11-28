import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";

import { StatusBar } from "expo-status-bar";
import firebase from "../config";
import React from "react";

const auth = firebase.auth();
export default function NewUser({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const createrNewUser = () => {
    if (password == confirmPassword) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          console.log("res:", res);
          navigation.navigate("home");
        })
        .catch((err) => alert(err));
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.auth_container}>
        <Text style={{ color: "white", fontSize: 30 }}>Create new user</Text>
        <TextInput
          style={styles.text_input}
          placeholder="Email"
          placeholderTextColor="#FFF"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.text_input}
          placeholder="Password"
          placeholderTextColor="#FFF"
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.text_input}
          placeholder="Confirm password"
          placeholderTextColor="#FFF"
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <View style={{ flex: 0, flexDirection: "row", gap: 10 }}>
          <Button title="Create" onPress={createrNewUser} />
          <Button title="Cancel" onPress={() => navigation.navigate("auth")} />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  auth_container: {
    backgroundColor: "#0003",
    width: "90%",
    paddingTop: 50,
    height: 350,
    flex: 0,
    gap: 10,
    alignItems: "center",
    justifyContent: "start",
    borderRadius: 10,
  },
  text_input: {
    backgroundColor: "#0003",
    width: "60%",
    borderRadius: 10,
    padding: 10,
    color: "white",
    textAlign: "center",
  },
});
