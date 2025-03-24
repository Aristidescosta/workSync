import { Box, Input, InputProps, Text } from "@chakra-ui/react";

interface CustomInputProps extends InputProps {
  label: string;
}

export function ToqueInput({ label, ...rest }: CustomInputProps) {
  return (
    <Box>
      <Text as="label" fontSize="15px">
        {label}
      </Text>
      <Input
        my="3"
        py={2}
        px={4}
        borderRadius="5px"
        border="1px solid #ddd"
        _hover={{ border: "1px solid gray.100" }}
        {...rest}
      />
    </Box>
  );
}
