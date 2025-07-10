import React from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  SimpleGrid,
  Stack,
  Badge,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const BusCardList = ({ busData }) => {
  const navigate = useNavigate();

  const handleNavigate = (id, type) => {
    navigate(`/SeatSelector/${id}/${type}`);
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={4}>
      {busData.map((bus) => (
        <Box
          key={bus.id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          bg="white"
        >
          <Image
            src="/images/images (1).jpg"
            alt={`Bus ${bus.jurusan}`}
            objectFit="cover"
            w="100%"
            h="232px"
          />

          <Box p={4}>
            <Heading size="md" mb={2}>
              {bus.jurusan}
            </Heading>
            <Stack spacing={1} mb={3}>
              <Text>
                <Badge colorScheme="teal" mr={2}>
                  {bus.type}
                </Badge>
                Tipe Bus
              </Text>
              <Text>
                <strong>{bus.jumlah_bangku}</strong> Bangku
              </Text>
              <Text>
                Berangkat: <strong>{bus.waktu_berangkat}</strong>
              </Text>
            </Stack>

            {/* ✅ Tombol Navigasi */}
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => handleNavigate(bus.id, bus.type)}
            >
              Pilih Kursi
            </Button>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default BusCardList;
