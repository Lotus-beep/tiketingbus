import React, { useState, useEffect } from "react";
import { Booking, GetbyId } from "../endPoint/Api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  HStack,
  Spinner,
  useToast,
  Divider,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { MdChair } from "react-icons/md";

const Legend = () => (
  <HStack spacing={6} justify="center" p={4} bg="gray.50" borderRadius="md" w="100%">
    <HStack>
      <Box w={4} h={4} bg="gray.300" borderRadius="sm" />
      <Text fontSize="sm">Tersedia</Text>
    </HStack>
    <HStack>
      <Box w={4} h={4} bg="red.400" borderRadius="sm" />
      <Text fontSize="sm">Terisi (Nonaktif)</Text>
    </HStack>
    <HStack>
      <Box w={4} h={4} bg="teal.400" borderRadius="sm" />
      <Text fontSize="sm">Terisi (Aktif)</Text>
    </HStack>
    <HStack>
      <Box w={4} h={4} bg="teal.200" borderRadius="sm" />
      <Text fontSize="sm">Pilihan Anda</Text>
    </HStack>
  </HStack>
);

const busLayout = [
  [1, 2, null, 3, 4],
  [5, 6, null, 7, 8],
  [9, 10, null, 11, 12],
  [13, 14, null, 15, 16],
  [17, 18, null, 19, 20],
  [21, 22, null, 23, 24],
  [25, 26, null, 27, 28],
  [29, 30, null, 31, 32],
  [33, 34, null, 35, 36],
  [37, 38, null, 39, 40],
];

const SeatSelector = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [bookedSeats, setBookedSeats] = useState({}); // { no_bangku: status }
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tentukan harga berdasarkan tipe bus
  const pricePerSeat = type === "Executive" ? 500000 : 100000;
  const totalPrice = selectedSeats.length * pricePerSeat;

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const bookedSeatsData = await GetbyId(id);
        if (Array.isArray(bookedSeatsData)) {
          const seatsMap = {};
          bookedSeatsData.forEach((seat) => {
            seatsMap[seat.no_bangku] = seat.status;
          });
          setBookedSeats(seatsMap);
        }
      } catch (error) {
        console.error("Failed to fetch seat data:", error);
        toast({
          title: "Gagal Memuat Data",
          description: "Tidak dapat memuat data kursi. Silakan coba lagi.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeatData();
  }, [id, navigate, toast]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.hasOwnProperty(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const getSeatStatus = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) return "selected";
    if (bookedSeats.hasOwnProperty(seatNumber)) {
      return bookedSeats[seatNumber] ? "booked-active" : "booked-inactive";
    }
    return "available";
  };

  const handleSubmit = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "Pilih Kursi",
        description: "Anda harus memilih setidaknya satu kursi.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await Booking(id, selectedSeats, type);
      if (response && response.error) {
        throw new Error(response.error);
      }
      toast({
        title: "Booking Berhasil",
        description: "Mengarahkan Anda ke halaman pembayaran.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/tiket/Payment/${id}/${type}/${selectedSeats.length}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error.message || "Terjadi kesalahan saat melakukan booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <VStack justify="center" align="center" h="80vh">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Memuat data kursi...</Text>
      </VStack>
    );
  }

  return (
    <Box maxW="container.lg" mx="auto" p={6}>
      <VStack spacing={6}>
        <Heading as="h1" size="lg">
          Pilih Kursi Anda
        </Heading>
        
        {/* Tambahkan badge untuk menampilkan tipe bus dan harga per bangku */}
        <Badge 
          colorScheme={type === "Executive" ? "purple" : "green"} 
          fontSize="lg" 
          p={2} 
          borderRadius="md"
        >
          {type === "Executive" ? "Executive" : "Regular"} - 
          Harga per bangku: {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(pricePerSeat)}
        </Badge>

        <Legend />

        <Box p={{ base: 3, md: 6 }} borderWidth={1} borderRadius="lg" w="fit-content" mx="auto">
          <HStack justifyContent="flex-end" w="100%" pr={4} mb={4}>
            <Text color="gray.500" fontWeight="bold">DEPAN</Text>
          </HStack>
          <VStack spacing={{ base: 3, md: 4 }}>
            {busLayout.map((row, rowIndex) => (
              <HStack key={rowIndex} spacing={{ base: 3, md: 4 }}>
                {row.map((seatNumber, seatIndex) => {
                  if (seatNumber === null) {
                    return <Box key={`aisle-${rowIndex}-${seatIndex}`} w={{ base: "1.5rem", md: "3rem" }} />;
                  }
                  const status = getSeatStatus(seatNumber);
                  return (
                    <Button
                      key={seatNumber}
                      onClick={() => handleSeatClick(seatNumber)}
                      isDisabled={status !== "available"}
                      w={{ base: "3rem", md: "3.75rem" }}
                      h={{ base: "3rem", md: "3.75rem" }}
                      colorScheme={
                        status === "selected" ? "teal" :
                        status === "booked-active" ? "teal" :
                        status === "booked-inactive" ? "red" : "gray"
                      }
                      variant={status === "available" ? "outline" : "solid"}
                    >
                      <VStack spacing={0}>
                        <Icon as={MdChair} boxSize={{ base: 5, md: 6 }}/>
                        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">{seatNumber}</Text>
                      </VStack>
                    </Button>
                  );
                })}
              </HStack>
            ))}
          </VStack>
        </Box>

        <VStack spacing={4} w="100%" maxW="md" p={5} borderWidth={1} borderRadius="lg" align="stretch">
          <Heading as="h3" size="md">
            Ringkasan Pesanan
          </Heading>
          <Divider />
          <HStack justify="space-between">
            <Text fontWeight="medium">Tipe Bus:</Text>
            <Text fontWeight="bold" color={type === "Executive" ? "purple.500" : "green.500"}>
              {type === "Executive" ? "Executive" : "Regular"}
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="medium">Kursi Dipilih:</Text>
            <Text fontWeight="bold" color="teal.600" maxWidth="70%" noOfLines={2}>
              {selectedSeats.length > 0
                ? selectedSeats.sort((a, b) => a - b).join(", ")
                : "Belum ada kursi dipilih"}
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="medium">Harga per Bangku:</Text>
            <Text fontWeight="bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(pricePerSeat)}
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="medium">Total Harga:</Text>
            <Text fontWeight="bold" fontSize="lg">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(totalPrice)}
            </Text>
          </HStack>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Memproses"
            isDisabled={selectedSeats.length === 0}
            w="100%"
          >
            Pesan & Lanjutkan ke Pembayaran
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SeatSelector;
