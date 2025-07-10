import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Menu as ChakraMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Stack,
  useBreakpointValue
} from "@chakra-ui/react";
import { FiMenu, FiUser, FiLogOut, FiClock, FiMapPin, FiHome, FiCalendar } from "react-icons/fi";
import { get_data, Logout } from "../endPoint/Api";

const JadwalBus = ({ data }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={6}>
      {data.map((item, index) => (
        <Card key={index} variant="outline" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <CardBody>
            <Stack spacing={4}>
              <Heading size="md">{item.namaBus}</Heading>
              <Text>
                <Text as="span" fontWeight="bold">Tujuan:</Text> {item.tujuan}
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">Berangkat:</Text> {item.tanggal} — {item.waktu}
              </Text>
            </Stack>
          </CardBody>
          <CardFooter>
            <Button colorScheme="teal" width="full" as="a" href="/menu">
              Pesan Sekarang
            </Button>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
};

const App = () => {
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

  const data = [
    {
      namaBus: "Sinar Jaya",
      tujuan: "Sukabumi",
      tanggal: "2025-07-03",
      waktu: "08:00"
    },
    {
      namaBus: "Rosalia Indah",
      tujuan: "Lampung",
      tanggal: "2025-07-03",
      waktu: "12:30"
    },
    {
      namaBus: "PO Haryanto",
      tujuan: "Cikampek",
      tanggal: "2025-07-03",
      waktu: "15:00"
    }
  ];
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = async () => {
    const res = await Logout();
    if (res === true) {
      navigate("/", { replace: true });
    }
  };

  return (
    <Box minH="100vh" bg={colors.pageBg}>
      {/* Navbar */}
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
              <Link href="/menu" _hover={{ color: colors.hoverColor }}><FiHome /> Home</Link>
              <Link href="/jadwal" _hover={{ color: colors.hoverColor }}><FiCalendar /> Jadwal</Link>
              <Link href="/profil" _hover={{ color: colors.hoverColor }}><FiUser /> Profil</Link>
            </HStack>
          )}
        </Flex>
        <HStack spacing={4}>
          {isMobile ? (
            <ChakraMenu>
              <MenuButton as={IconButton} icon={<FiMenu />} variant="outline" aria-label="Menu" />
              <MenuList>
                <MenuItem icon={<FiHome />} onClick={() => navigate("/menu")}>Home</MenuItem>
                <MenuItem icon={<FiCalendar />} onClick={() => navigate("/jadwal")}>Jadwal</MenuItem>
                <MenuItem icon={<FiUser />} onClick={() => navigate("/profil")}>Profil</MenuItem>
                <Divider />
                <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">Logout</MenuItem>
              </MenuList>
            </ChakraMenu>
          ) : (
            <Button colorScheme="red" variant="outline" leftIcon={<FiLogOut />} onClick={handleLogout}>
              Logout
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Hero */}
      <Box position="relative" h={{ base: "300px", md: "450px" }}>
        <Image src="/images/busC.jpg" alt="Travel Banner" w="100%" h="100%" objectFit="cover" filter="brightness(0.7)" />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-r, blackAlpha.600, transparent)"
          display="flex"
          alignItems="center"
          pl={{ base: 6, md: 20 }}
        >
          <VStack align="flex-start" spacing={5} maxW="600px">
            <Heading color="white" size="2xl" fontWeight="bold">
              Nikmati Perjalanan Nyaman Bersama Kami
            </Heading>
            <Text color="whiteAlpha.900" fontSize="lg">
              Pesan tiket bus Anda dengan mudah dan dapatkan pengalaman perjalanan terbaik
            </Text>
            <Button colorScheme="teal" size="lg" onClick={() => navigate("/jadwal")} rightIcon={<FiMapPin />}>
              Pesan Sekarang
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* Content */}
      <Container maxW="container.xl" py={10}>
        <Heading textAlign="center" mb={8} color={colors.brand}>
          <Text as="span" display="block" fontSize="xl" color={colors.subtleText} mb={2}>
            Temukan Perjalanan Anda
          </Text>
          Pilih Tiket Perjalanan
        </Heading>

        {/* Bus Cards */}
        <JadwalBus data={data} />

        {/* Features */}
        <Box mt={20}>
          <Heading textAlign="center" mb={10} color={colors.brand}>Mengapa Memilih Kami?</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {[
              { icon: "🚌", title: "Armada Nyaman", description: "Bus dengan fasilitas lengkap dan kenyamanan maksimal" },
              { icon: "⏱️", title: "Tepat Waktu", description: "Keberangkatan dan kedatangan sesuai jadwal" },
              { icon: "🛡️", title: "Perjalanan Aman", description: "Pengemudi profesional dan prosedur keselamatan ketat" }
            ].map((feature, i) => (
              <Box key={i} textAlign="center" p={6} borderRadius="xl" bg={colors.cardBg} boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "translateY(-3px)" }} transition="all 0.2s">
                <Text fontSize="4xl" mb={4}>{feature.icon}</Text>
                <Heading size="md" mb={3}>{feature.title}</Heading>
                <Text color={colors.subtleText}>{feature.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>

      {/* Footer */}
      <Box bg={colors.footerBg} py={10} mt={16}>
        <Container maxW="container.xl">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
            <Box mb={{ base: 6, md: 0 }}>
              <Heading size="lg" color={colors.brand}>TikeBus</Heading>
              <Text mt={2} color={colors.subtleText}>Solusi pemesanan tiket bus online terpercaya</Text>
            </Box>
            <HStack spacing={8}>
              {["Tentang Kami", "Kontak", "Syarat & Ketentuan", "Kebijakan Privasi"].map((text, i) => (
                <Link key={i} href="#" color={colors.subtleText} _hover={{ color: colors.hoverColor }}>
                  {text}
                </Link>
              ))}
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

export default App;
