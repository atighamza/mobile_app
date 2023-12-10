import { StatusBar } from "expo-status-bar";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthProvider";
import firebase from "../config";
import {
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const userCredentials = () => {
  Alert.alert();
};

const auth = firebase.auth();
export default function Auth({ navigation }) {
  const [email, setEmail] = useState("fatmafatou3@gmail.com");
  const [password, setPassword] = useState("123456");
  const { currentUserID, setCurrentUserID } = useContext(AuthContext);
  useEffect(() => {
    /*if (true) {
      navigation.navigate("home");
    }*/
  }, []);
  const signIn = () => {
    console.log("email", email, " password : ", password);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        const currentId = auth.currentUser.uid;
        setCurrentUserID(currentId);
        navigation.navigate("home", { currentId });
      })
      .catch((err) => alert(err));
  };
  return (
    <View style={styles.container}>
      <View style={styles.auth_container}>
        <Text style={{ color: "white", fontSize: 30 }}>Authentification</Text>
        <TextInput
          style={styles.text_input}
          value={email}
          placeholder="Email"
          placeholderTextColor="#FFF"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.text_input}
          value={password}
          placeholder="Password"
          placeholderTextColor="#FFF"
          onChangeText={(text) => setPassword(text)}
        />
        <View style={{ flex: 0, flexDirection: "row", gap: 10 }}>
          <Button title="Submit" onPress={signIn} />
          <Button title="Cancel" onPress={() => BackHandler.exitApp()} />
        </View>
        <Text
          style={{
            color: "white",
            alignSelf: "flex-end",
            paddingRight: 5,
            marginTop: 20,
          }}
          onPress={() => navigation.navigate("newUser")}
        >
          Create new user
        </Text>
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
