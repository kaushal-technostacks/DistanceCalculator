import React from "react";
import { Text, Heading, Button, VStack, Center, Box } from "native-base";

export default function CustomButton({ title = "", onPress }) {
  return (
    <Box alignItems="center">
      <Button
        size={"lg"}
        width="80%"
        height={50}
        variant="solid"
        _text={{ fontWeight: "bold" }}
        onPress={() => onPress()}
      >
        {title}
      </Button>
    </Box>
  );
}
