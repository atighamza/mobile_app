import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";

export default function Test() {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [audioData, setAudioData] = useState([]);

  const startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    if (status === "granted") {
      try {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        console.log("start recording");
      } catch (error) {
        console.error("Failed to start recording", error);
      }
    } else {
      console.error("Audio recording permission not granted");
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      console.log("stopped recording");
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const playAudio = async (audioUrl) => {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    console.log("playing record");
    await sound.playAsync();
  };

  const processAudioData = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    const { durationMillis } = await sound.getStatusAsync();
    const interval = durationMillis / 100;

    for (let i = 0; i <= durationMillis; i += interval) {
      const position = i / durationMillis;
      const amplitude = await sound.getAmplitudeAsync(i);
      setAudioData((prevData) => [...prevData, { position, amplitude }]);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {audioData.map((data, index) => (
        <View
          key={index}
          style={{
            width: 2,
            height: data.amplitude * 50,
            backgroundColor: "#000",
          }}
        />
      ))}
      <TouchableOpacity onPress={startRecording}>
        <Text>Start Recording</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={stopRecording}>
        <Text>Stop recording</Text>
      </TouchableOpacity>

      {recording && <Text>Recording...</Text>}
      <TouchableOpacity onPress={() => processAudioData()}>
        <Text>Play Voice</Text>
      </TouchableOpacity>
    </View>
  );
}
