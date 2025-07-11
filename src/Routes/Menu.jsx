import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Heading,
  Image,
  useColorModeValue,
  Container,
  VStack,
  Text,
  IconButton,
  Menu as ChakraMenu, // Renamed import
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Badge,
  Spacer,
  useBreakpointValue
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiMenu, FiUser, FiLogOut, FiClock, FiMapPin, FiHome, FiCalendar } from "react-icons/fi";
import { get_notes, Logout, call_refresh, get_data } from "../endPoint/Api";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  // Define all color mode values at the top level
  const colors = {
    pageBg: useColorModeValue("gray.50", "gray.800"),
    navBg: useColorModeValue("white", "gray.900"),
    navText: useColorModeValue("gray.700", "white"),
    brand: useColorModeValue("teal.500", "teal.300"),
    cardBg: useColorModeValue("white", "gray.700"),
    footerBg: useColorModeValue("gray.100", "gray.900"),
    subtleText: useColorModeValue("gray.500", "gray.400"),
    hoverColor: useColorModeValue("teal.500", "teal.300")
  };

  const [notes, setNote] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const fetchNote = async () => {
    try {
      const response = await get_notes();
      const res = await get_data();
      setData(res);
      setNote(response);
      console.log(data)
    } catch (error) {
      console.log(error);
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
  };

  return (
    <Box minH="100vh" bg={colors.pageBg}>
      {/* Modern Navigation Bar */}
      <Flex
        as="nav"
        bg={colors.navBg}
        color={colors.navText}
        px={6}
        py={4}
        justify="space-between"
        align="center"
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <Flex align="center">
          <Heading size="lg" color={colors.brand} mr={10}>
            TikeBus
          </Heading>
          
          {!isMobile && (
            <HStack spacing={8}>
              <Link href="/menu" fontWeight="medium" _hover={{ color: colors.hoverColor }} display="flex" alignItems="center">
                <FiHome style={{ marginRight: "6px" }} /> Home
              </Link>
              <Link href="/jadwal" fontWeight="medium" _hover={{ color: colors.hoverColor }} display="flex" alignItems="center">
                <FiCalendar style={{ marginRight: "6px" }} /> Jadwal
              </Link>
              <Link href="/profil" fontWeight="medium" _hover={{ color: colors.hoverColor }} display="flex" alignItems="center">
                <FiUser style={{ marginRight: "6px" }} /> Profil
              </Link>
            </HStack>
          )}
        </Flex>

        <HStack spacing={4}>
          {isMobile ? (
            <ChakraMenu> {/* Use renamed import here */}
              <MenuButton
                as={IconButton}
                icon={<FiMenu />}
                variant="outline"
                aria-label="Menu"
              />
              <MenuList>
                <MenuItem icon={<FiHome />} onClick={() => navigate("/menu")}>
                  Home
                </MenuItem>
                <MenuItem icon={<FiCalendar />} onClick={() => navigate("/jadwal")}>
                  Jadwal
                </MenuItem>
                <MenuItem icon={<FiUser />} onClick={() => navigate("/profil")}>
                  Profil
                </MenuItem>
                <Divider />
                <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </ChakraMenu>
          ) : (
            <Button
              colorScheme="red"
              variant="outline"
              leftIcon={<FiLogOut />}
              onClick={handleLogout}
              size="sm"
            >
              Logout
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Hero Banner with Overlay */}
      <Box position="relative" h={{ base: "300px", md: "450px" }} overflow="hidden">
        <Image
          src="/images/busC.jpg"
          alt="Travel Banner"
          w="100%"
          h="100%"
          objectFit="cover"
          filter="brightness(0.7)"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-r, blackAlpha.600, transparent)"
          display="flex"
          alignItems="center"
          pl={{ base: 6, md: 20 }}
        >
          <VStack align="flex-start" spacing={5} maxW="600px">
            <Heading
              color="white"
              size="2xl"
              fontWeight="bold"
              lineHeight="1.2"
              textShadow="2px 2px 4px rgba(0,0,0,0.5)"
            >
              Nikmati Perjalanan Nyaman Bersama Kami
            </Heading>
            <Text
              color="whiteAlpha.900"
              fontSize="lg"
              textShadow="1px 1px 2px rgba(0,0,0,0.5)"
            >
              Pesan tiket bus Anda dengan mudah dan dapatkan pengalaman perjalanan terbaik
            </Text>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate("/jadwal")}
              rightIcon={<FiMapPin />}
            >
              Pesan Sekarang
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={10}>
        <Heading textAlign="center" mb={8} color={colors.brand}>
          <Text as="span" display="block" fontSize="xl" color={colors.subtleText} mb={2}>
            Temukan Perjalanan Anda
          </Text>
          Pilih Tiket Perjalanan
        </Heading>

        {/* Bus Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {data.map((bus, index) => (
            <Card key={index} borderRadius="xl" overflow="hidden" boxShadow="md" _hover={{ transform: "translateY(-5px)", transition: "all 0.3s" }} bg={colors.cardBg}>
              <Box h="180px" overflow="hidden">
                <Image
                  src={bus.image || "/images/images.jpg"}
                  alt={bus.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>
              <CardBody>
                <Stack spacing={3}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{bus.name || "Bus Premium"}</Heading>
                    <Badge colorScheme="green" px={2}>
                      {bus.seats || "12"} Kursi Tersedia
                    </Badge>
                  </Flex>
                  <Text color={colors.subtleText}>{bus.route || "Jakarta - Bandung"}</Text>
                  <Flex align="center" color={colors.subtleText}>
                    <FiClock style={{ marginRight: "8px" }} />
                    <Text>{bus.time || "08:00 - 12:00"}</Text>
                  </Flex>
                  <Text fontSize="xl" fontWeight="bold" color={colors.brand}>
                    {bus.price || "Rp 150.000"}
                  </Text>
                </Stack>
              </CardBody>
              <CardFooter>
                <Button
                  w="full"
                  colorScheme="teal"
                  onClick={() => navigate(`SeatSelector/${bus.id}/${bus.type}`)}
                >
                  Pesan Tiket
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>

        {/* Features Section */}
        <Box mt={20}>
          <Heading textAlign="center" mb={10} color={colors.brand}>
            Mengapa Memilih Kami?
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {[
              {
                icon: "🚌",
                title: "Armada Nyaman",
                description: "Bus dengan fasilitas lengkap dan kenyamanan maksimal"
              },
              {
                icon: "⏱️",
                title: "Tepat Waktu",
                description: "Keberangkatan dan kedatangan sesuai jadwal"
              },
              {
                icon: "🛡️",
                title: "Perjalanan Aman",
                description: "Pengemudi profesional dan prosedur keselamatan ketat"
              }
            ].map((feature, index) => (
              <Box
                key={index}
                textAlign="center"
                p={6}
                borderRadius="xl"
                bg={colors.cardBg}
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "translateY(-3px)" }}
                transition="all 0.2s"
              >
                <Text fontSize="4xl" mb={4}>
                  {feature.icon}
                </Text>
                <Heading size="md" mb={3}>
                  {feature.title}
                </Heading>
                <Text color={colors.subtleText}>{feature.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>

      {/* Footer */}
      <Box bg={colors.footerBg} py={10} mt={16}>
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
          >
            <Box mb={{ base: 6, md: 0 }}>
              <Heading size="lg" color={colors.brand}>
                TikeBus
              </Heading>
              <Text mt={2} color={colors.subtleText}>
                Solusi pemesanan tiket bus online terpercaya
              </Text>
            </Box>
            <HStack spacing={8}>
              <Link href="#" color={colors.subtleText} _hover={{ color: colors.hoverColor }}>
                Tentang Kami
              </Link>
              <Link href="#" color={colors.subtleText} _hover={{ color: colors.hoverColor }}>
                Kontak
              </Link>
              <Link href="#" color={colors.subtleText} _hover={{ color: colors.hoverColor }}>
                Syarat & Ketentuan
              </Link>
              <Link href="#" color={colors.subtleText} _hover={{ color: colors.hoverColor }}>
                Kebijakan Privasi
              </Link>
            </HStack>
          </Flex>
          <Divider my={6} />
          <Text textAlign="center" color={colors.subtleText}>
            © {new Date().getFullYear()} TikeBus. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default MainMenu;