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
import BusCardList from "../Components/BusCardlist";
import { get_notes, Logout ,call_refresh, get_data} from "../endPoint/Api";
import { useNavigate } from "react-router-dom";
import ProfilePage from "../Components/ProfilPage";

const Profil = () => {
  const [notes, setNote] = useState([]);
  const [data,setdata] = useState([])
  const navigate = useNavigate();

  const fetchNote = async () => {
    try {
      const response = await get_notes();
      const res = await get_data();
      setdata(res)
      setNote(response);
    } catch (error) {
      console.log(error)
      navigate("/", { replace: true });
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
    <ProfilePage/>
    </Box>
  );
};

export default Profil;
