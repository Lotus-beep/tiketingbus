import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../endPoint/Api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    Name: "",
    Password: "",
  });
  const [errors, setErrors] = useState({
    Name: "",
    Password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Username validation
    if (!formData.Name.trim()) {
      newErrors.Name = "Username is required";
      valid = false;
    }

    // Password validation
    if (!formData.Password) {
      newErrors.Password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await login(formData.Name, formData.Password);

        if (res.success === true) {
          toast({
            title: "Login successful",
            description: "Welcome back!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/menu", { replace: true });
        } else {
          toast({
            title: "Login failed",
            description: res.message || "Invalid username or password",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred during login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Login error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt="20"
      p="8"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <VStack as="form" spacing={6} align="stretch" onSubmit={handleLogin}>
        <Heading size="lg" textAlign="center">
          Login
        </Heading>

        <FormControl isInvalid={!!errors.Name}>
          <FormLabel>Username</FormLabel>
          <Input
            name="Name"
            placeholder="Enter username"
            value={formData.Name}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.Name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.Password}>
          <FormLabel>Password</FormLabel>
          <Input
            name="Password"
            type="password"
            placeholder="Enter password"
            value={formData.Password}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.Password}</FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="teal"
          size="md"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Logging in..."
        >
          Login
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Don't have an account?{" "}
          <Text as="a" href="/Register" color="teal.500" textDecoration="underline">
            Register here 😄
          </Text>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;