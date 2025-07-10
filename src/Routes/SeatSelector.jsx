import React, { useState, useEffect } from "react";
import { Booking, GetbyId, get_notes } from "../endPoint/Api"; // Pastikan path ini benar
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Heading,
  VStack,
  Text,
  HStack,
  Spinner,
  useToast,
  SimpleGrid,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { MdChair } from "react-icons/md";

// Komponen kecil untuk menampilkan legenda
const Legend = () => (
  <HStack spacing={6} justify="center" p={4} bg="gray.50" borderRadius="md" w="100%">
    <HStack>
      <Box w={4} h={4} bg="gray.300" borderRadius="sm" />
      <Text fontSize="sm">Tersedia</Text>
    </HStack>
    <HStack>
      <Box w={4} h={4} bg="red.400" borderRadius="sm" />
      <Text fontSize="sm">Terisi</Text>
    </HStack>
    <HStack>
      <Box w={4} h={4} bg="teal.400" borderRadius="sm" />
      <Text fontSize="sm">Pilihan Anda</Text>
    </HStack>
  </HStack>
);

// Layout Bus - Konfigurasi ini membuat komponen lebih fleksibel
// `null` merepresentasikan lorong
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

  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const bookedSeatsData = await GetbyId(id);
        if (Array.isArray(bookedSeatsData)) {
          const filledSeats = bookedSeatsData
            .filter(seat => seat.status === true)
            .map(seat => seat.no_bangku);
          setBookedSeats(new Set(filledSeats));
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
    if (bookedSeats.has(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const getSeatStatus = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) return "selected";
    if (bookedSeats.has(seatNumber)) return "booked";
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

  const pricePerSeat = 50000;
  const totalPrice = selectedSeats.length * pricePerSeat;

  return (
    <Box maxW="container.lg" mx="auto" p={6}>
      <VStack spacing={6}>
        <Heading as="h1" size="lg">
          Pilih Kursi Anda
        </Heading>
        <Legend />

        {/* ======================= AREA PERUBAHAN ======================= */}
        <Box p={{ base: 3, md: 6 }} borderWidth={1} borderRadius="lg" w="fit-content" mx="auto">
          <HStack justifyContent="flex-end" w="100%" pr={4} mb={4}>
             <Text color="gray.500" fontWeight="bold">DEPAN</Text>
          </HStack>
          {/* DIUBAH: spacing pada VStack diperbesar */}
          <VStack spacing={{ base: 3, md: 4 }}>
            {busLayout.map((row, rowIndex) => (
              // DIUBAH: spacing pada HStack diperbesar
              <HStack key={rowIndex} spacing={{ base: 3, md: 4 }}>
                {row.map((seatNumber, seatIndex) => {
                  if (seatNumber === null) {
                    // DIUBAH: lebar lorong diperbesar
                    return <Box key={`aisle-${rowIndex}-${seatIndex}`} w={{ base: "1.5rem", md: "3rem" }} />;
                  }
                  const status = getSeatStatus(seatNumber);
                  return (
                    <Button
                      key={seatNumber}
                      onClick={() => handleSeatClick(seatNumber)}
                      isDisabled={status === "booked"}
                      // DIUBAH: Ukuran tombol diperbesar dan dibuat responsif
                      w={{ base: "3rem", md: "3.75rem" }}
                      h={{ base: "3rem", md: "3.75rem" }}
                      colorScheme={status === "selected" ? "teal" : status === "booked" ? "red" : "gray"}
                      variant={status === "available" ? "outline" : "solid"}
                    >
                      <VStack spacing={0}>
                         {/* DIUBAH: Ukuran ikon diperbesar */}
                         <Icon as={MdChair} boxSize={{ base: 5, md: 6 }}/>
                         {/* DIUBAH: Ukuran font diperbesar */}
                         <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">{seatNumber}</Text>
                      </VStack>
                    </Button>
                  );
                })}
              </HStack>
            ))}
          </VStack>
        </Box>
        {/* ======================= AKHIR AREA PERUBAHAN ======================= */}
        
        <VStack
          spacing={4}
          w="100%"
          maxW="md"
          p={5}
          borderWidth={1}
          borderRadius="lg"
          align="stretch"
        >
          <Heading as="h3" size="md">
            Ringkasan Pesanan
          </Heading>
          <Divider />
          <HStack justify="space-between">
            <Text fontWeight="medium">Kursi Dipilih:</Text>
            <Text fontWeight="bold" color="teal.600" maxWidth="70%" noOfLines={2}>
              {selectedSeats.length > 0
                ? selectedSeats.sort((a, b) => a - b).join(", ")
                : "Belum ada kursi dipilih"}
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