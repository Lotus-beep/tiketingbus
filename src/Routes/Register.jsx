import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../endPoint/Api";
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

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
  });
  const [errors, setErrors] = useState({
    Name: "",
    Email: "",
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

    // Name validation
    if (!formData.Name.trim()) {
      newErrors.Name = "Username is required";
      valid = false;
    } else if (formData.Name.length < 3) {
      newErrors.Name = "Username must be at least 3 characters";
      valid = false;
    }

    // Email validation
    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!formData.Password) {
      newErrors.Password = "Password is required";
      valid = false;
    } else if (formData.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await userRegister(
          formData.Name,
          formData.Email,
          formData.Password
        );

        if (res.success === true) {
          toast({
            title: "Registration successful",
            description: "You have successfully registered",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/", { replace: true });
        } else {
          toast({
            title: "Registration failed",
            description: res.message || "Please try again",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred during registration",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Registration error:", error);
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
      <VStack as="form" spacing={6} align="stretch" onSubmit={handleSubmit}>
        <Heading size="lg" textAlign="center">
          Register
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

        <FormControl isInvalid={!!errors.Email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="Email"
            type="email"
            placeholder="Enter email"
            value={formData.Email}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.Email}</FormErrorMessage>
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
          loadingText="Registering..."
        >
          Register
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Already have an account?{" "}
          <Text as="a" href="/" color="teal.500" textDecoration="underline">
            Login
          </Text>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register;