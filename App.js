import React, { useEffect, useState, useRef } from "react";
import { Center, NativeBaseProvider, extendTheme, VStack } from "native-base";
import { AppState } from "react-native";
import * as Location from "expo-location";
import Home from "./src/screens/Home";
import PermissionScreen from "./src/screens/PermissionScreen";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
  colors: {
    primary: "#00ff00",
  },
};

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  const [locationPermission, setLocationPermission] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const config = async () => {
    let enableStatus = await Location.hasServicesEnabledAsync();
    if (enableStatus) {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status !== "granted" && resb.status !== "granted") {
        console.log("Permission to access location was denied");
        setLocationPermission(false);
      } else {
        console.log("Permission to access location granted");
        setLocationPermission(true);
      }
    } else {
      setLocationPermission(false);
    }
  };
  useEffect(() => {
    config();
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      config();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  console.log("locationPermission -->", locationPermission);
  return (
    <NativeBaseProvider>
      <Center _light={{ bg: "blueGray.50" }} px={4} flex={1}>
        <VStack space={5} alignItems="center">
          {locationPermission == true ? <Home /> : <PermissionScreen />}
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
}
