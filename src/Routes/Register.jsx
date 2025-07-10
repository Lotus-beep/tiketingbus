import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, userRegister } from "../endPoint/Api";
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
} from "@chakra-ui/react";

const Register = () => {
  const navigate = useNavigate()
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    console.log(Password)
    const res = await userRegister(Name,Email, Password); 
    console.log(res);

    if (res.success === true) {
      console.log("Login berhasil");
      navigate("/", { replace: true });
    } else {
      console.log("Login gagal");
    }
  } catch (error) {
    console.error("Terjadi kesalahan login");
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
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">
          Login
        </Heading>

        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Masukkan username"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Masukkan Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Masukkan password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="teal" size="md" onClick={handleLogin}>
          Login
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          kemabali kehalaman login <a href="/">login</a>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register;
