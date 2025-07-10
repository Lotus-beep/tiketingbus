import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Heading,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { get_notes, Logout , get_tiket} from "../endPoint/Api";
import { useNavigate } from "react-router-dom";
import TiketCardList from "../Components/CardList";

const CreateTiket = () => {
  const [notes, setNote] = useState([]);
  const [data,setdata] = useState([])
  const navigate = useNavigate();

  const fetchNote = async () => {
    try {
      const response = await get_notes();
      const res = await get_tiket();
      setNote(response);
      setdata(res);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleLogout = async () => {
    const res = await Logout();
    if (res === true) {
      navigate("/", { replace: true });
    }
    console.log("not success");
  };

  return (
    <Box>
      <Flex
        as="nav"
        bg={useColorModeValue("teal.500", "teal.700")}
        color="white"
        padding="4"
        justify="space-between"
        align="center"
        boxShadow="md"
      >
        <Heading size="md">TikeBus</Heading>
        <HStack spacing="6">
          <Link href="/menu" fontWeight="medium">
            Home
          </Link>
          <Link href="/jadwal" fontWeight="medium">
            Jadwal Perjalanan
          </Link>
          <Link href="/profil" fontWeight="medium">
            Profil
          </Link>
          <Button onClick={handleLogout} colorScheme="red" size="sm">
            Logout
          </Button>
        </HStack>
      </Flex>

      <TiketCardList data={data} />
    </Box>
  );
};

export default CreateTiket;
