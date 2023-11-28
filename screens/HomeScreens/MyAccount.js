import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { useState } from "react";
import React from "react";
import userPhoto from "../../assets/user.png";
import firebase from "../../config";

const database = firebase.database();

export default function MyAccount() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numero, setNumero] = useState("");

  const createProfile = () => {
    const ref_profils = database.ref("profils");
    const key = ref_profils.push().key;
    const ref_profil = ref_profils.child("profil" + key);
    ref_profil.set({
      nom,
      prenom,
      numero,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>MyAccount</Text>
      <Image
        source={userPhoto}
        style={{ width: 100, height: 100, marginVertical: 20 }}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Nom"
        placeholderTextColor="#FFF"
        onChangeText={(text) => setNom(text)}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Prenom"
        placeholderTextColor="#FFF"
        onChangeText={(text) => setPrenom(text)}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Numero"
        placeholderTextColor="#FFF"
        onChangeText={(text) => setNumero(text)}
      />
      <Button title="Create" onPress={createProfile} />
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
  text_input: {
    backgroundColor: "#0003",
    width: "60%",
    borderRadius: 10,
    padding: 10,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
});
