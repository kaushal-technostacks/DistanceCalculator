import React from "react";
import {
  Text,
  Heading,
  Button,
  VStack,
  Center,
  HStack,
  Box,
} from "native-base";
import CustomButton from "../components/Button";
import { Platform } from "react-native";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import { Linking } from "react-native";

export default function Permission() {
  return (
    <VStack space={5} alignItems="center">
      <Heading size="lg">Please Enable Location</Heading>
      <HStack space={2} alignItems="center">
        <CustomButton
          title="Enable"
          onPress={() => {
            console.log("Enable Button Pressed");
            Platform.select({
              ios: Linking.openURL("app-settings:"),
              android: startActivityAsync(
                ActivityAction.LOCATION_SOURCE_SETTINGS
              ),
            });
          }}
        />
      </HStack>
    </VStack>
  );
}
