import { forwardRef } from "react";
import type React from "react";
import {
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
  Field,
  Flex,
  Box,
} from "@chakra-ui/react";

interface InputProps extends Omit<ChakraInputProps, "size"> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  rightInputElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightElement, rightInputElement, ...props }, ref) => {
    const isInvalid = !!error;

    return (
      <Field.Root invalid={isInvalid}>
        {label && (
          <>
            {rightElement ? (
              <Flex justify="space-between" align="center" mb="2" w="100%">
                <Field.Label
                  htmlFor={props.id}
                  mb="0"
                  fontSize="0.9rem"
                  fontWeight="600"
                  color="var(--foreground)"
                >
                  {label}
                </Field.Label>
                {rightElement}
              </Flex>
            ) : (
              <Field.Label
                htmlFor={props.id}
                fontSize="0.9rem"
                fontWeight="600"
                color="var(--foreground)"
              >
                {label}
              </Field.Label>
            )}
          </>
        )}
        {rightInputElement ? (
          <Box
            position="relative"
            display="flex"
            alignItems="center"
            width="100%"
          >
            <ChakraInput
              ref={ref}
              px="1rem"
              py="0.875rem"
              pr="3rem"
              h="auto"
              borderRadius="12px"
              borderWidth="1.5px"
              fontSize="0.95rem"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _focus={{
                borderColor: "var(--input-focus)",
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
              }}
              _hover={{
                borderColor: "var(--input-border)",
              }}
              bg="var(--input-bg)"
              borderColor={isInvalid ? "var(--error)" : "var(--input-border)"}
              color="var(--input-text)"
              css={{
                "&::placeholder": {
                  color: "var(--input-placeholder)",
                },
              }}
              {...props}
            />
            <Box
              position="absolute"
              right="0.75rem"
              top="50%"
              transform="translateY(-50%)"
              display="flex"
              alignItems="center"
            >
              {rightInputElement}
            </Box>
          </Box>
        ) : (
          <ChakraInput
            ref={ref}
            px="1rem"
            py="0.875rem"
            h="auto"
            borderRadius="12px"
            borderWidth="1.5px"
            fontSize="0.95rem"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _focus={{
              borderColor: "var(--input-focus)",
              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
            }}
            _hover={{
              borderColor: "var(--input-border)",
            }}
            bg="var(--input-bg)"
            borderColor={isInvalid ? "var(--error)" : "var(--input-border)"}
            color="var(--input-text)"
            css={{
              "&::placeholder": {
                color: "var(--input-placeholder)",
              },
            }}
            {...props}
          />
        )}
        {isInvalid && (
          <Field.ErrorText
            mt="1.5"
            fontSize="0.8rem"
            fontWeight="500"
            color="var(--error)"
          >
            {error}
          </Field.ErrorText>
        )}
      </Field.Root>
    );
  }
);

Input.displayName = "Input";
