import React, { useState, useEffect, useRef } from "react";
import {
  VStack,
  Box,
  Stack,
  FormControl,
  Input,
  AlertDialog,
  Button,
} from "native-base";
import { Linking } from "react-native";
import CustomButton from "../components/Button";
import { getDistanceFromLatLonInKm } from "../utils/Calculations";
import { Audio } from "expo-av";
import Assets from "../../assets";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TRACKING = "location-tracking";

let setCurrentCordsToState = () => {
  console.log("State not yet initialized");
};

export default function Home() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [playBeep, setPlayBeep] = useState(false);
  const [sound, setSound] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = React.useState(null);
  const [cords, setCurrentCords] = useState(null);
  const [totalDistance, setTotalDistance] = useState();
  const [intervalId, setIntervalId] = useState(0);
  const cancelRef = useRef(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      startLocationTracking();
    } else {
    }
    setCurrentCordsToState = setCurrentCords;
  }, []);

  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5500,
      distanceInterval: 20,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    // console.log("tracking started?", hasStarted);
  };

  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
  });

  useEffect(() => {
    playBeep && checkCurrentStatus();
  }, [playBeep, cords]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(Assets.beepSound, {
      shouldPlay: true,
    });
    setSound(sound);
    await sound.playAsync();
  };

  const checkCurrentStatus = () => {
    if (
      cords?.latitude &&
      cords?.longitude &&
      latitude !== "" &&
      longitude !== ""
    ) {
      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        cords?.latitude,
        cords?.longitude
      );
      if (distance) {
        setTotalDistance(distance);
        distance * 1000 >= 1000 && intervalId == 0 && handleSoundInterval();
      }
    }
  };

  const handleSoundInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }

    const newIntervalId = setInterval(() => {
      playSound();
    }, 5500);
    setIntervalId(newIntervalId);
  };

  const findDistance = () => {
    console.log("cords -->", cords);
    if (cords?.latitude && cords?.longitude) {
      console.log("Before Actual Distance");
      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        cords?.latitude,
        cords?.longitude
      );
      console.log("Actual Distance -->", distance);
      if (distance) {
        setIsOpen(true);
        setTotalDistance(distance);
        setPlayBeep(true);
      }
    }
  };

  const onClose = () => {
    setIsOpen(false);
    setPlayBeep(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }
  };
  return (
    <VStack space={5} alignItems="center" w="100%">
      <Stack
        space={2}
        alignSelf="center"
        // px="4"
        safeArea
        mt="4"
        w={{
          base: "100%",
          md: "25%",
        }}
      >
        <Box w="100%">
          <FormControl mb="5" w="80%">
            <FormControl.Label>Latitude</FormControl.Label>
            <Input
              height={50}
              w="100%"
              placeholder="Eneter Latitude"
              keyboardType="number-pad"
              returnKeyType="next"
              backgroundColor={"white"}
              onChangeText={(latitude) => setLatitude(latitude)}
            />
            <FormControl.Label mt="5">Longitude</FormControl.Label>
            <Input
              height={50}
              w="100%"
              placeholder="Eneter Longitude"
              type="number"
              keyboardType="number-pad"
              returnKeyType="done"
              backgroundColor={"white"}
              onChangeText={(longitude) => setLongitude(longitude)}
            />
          </FormControl>
        </Box>
        <CustomButton
          title="Submit"
          onPress={() => {
            findDistance();
          }}
        />
      </Stack>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Distance</AlertDialog.Header>
          <AlertDialog.Body>
            Distance is {totalDistance * 1000}
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </VStack>
  );
}

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    var Obj = {
      latitude: lat,
      longitude: long,
    };
    setCurrentCordsToState(Obj);
  }
});
