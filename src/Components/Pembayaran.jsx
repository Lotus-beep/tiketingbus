import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddOrder } from "../endPoint/Api"; // Pastikan path ini benar
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Flex,
  Container,
  Text,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  useToast, // Import useToast untuk notifikasi
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons"; // Contoh ikon

const Pembayaran = () => {
  const { id, Total, type } = useParams();
  const [dana, setDana] = useState(""); // Gunakan string kosong untuk input terkontrol
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const totalCount = parseInt(Total, 10);
  const navigate = useNavigate();
  const toast = useToast(); // Inisialisasi toast

  // Fungsi untuk menghitung total harga
  const calculateTotal = () => {
    if (type === "Reguler") {
      return totalCount * 100000;
    } else {
      return totalCount * 500000;
    }
  };

  const totalAmount = calculateTotal();

  // Format angka menjadi format mata uang Rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleButton = async () => {
    setIsLoading(true);
    setError("");

    const danaNumber = parseFloat(dana);

    // Validasi: Dana tidak boleh kosong atau kurang dari total
    if (!danaNumber || danaNumber < totalAmount) {
      setError("Maaf, dana yang Anda masukkan tidak cukup.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await AddOrder(id, type, totalCount, danaNumber);
      if (res) {
        // Tampilkan notifikasi sukses
        toast({
          title: "Pembayaran Berhasil!",
          description: "Tiket Anda sedang dibuat.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        navigate("/CreateTiket/"); // Arahkan ke halaman tiket
      } else {
        throw new Error("Gagal menambahkan pesanan.");
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat memesan:", err);
      // Tampilkan notifikasi error
      toast({
        title: "Terjadi Kesalahan",
        description: err.message || "Tidak dapat memproses pembayaran Anda.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container centerContent py={{ base: "12", md: "24" }}>
      <Box
        w="full"
        maxW="lg" // Lebar box dibuat lebih nyaman
        p={8}
        borderWidth="1px"
        borderRadius="xl" // Sudut lebih bulat
        boxShadow="xl" // Bayangan lebih menonjol
        bg="white"
        borderColor="gray.200"
      >
        <VStack spacing={6} align="stretch">
          {/* Bagian Judul dan Total */}
          <VStack spacing={1} textAlign="center">
            <Text color="gray.500" fontSize="lg">
              Total Pembayaran
            </Text>
            <Heading size="2xl" color="teal.500">
              {formatCurrency(totalAmount)}
            </Heading>
            <Text fontSize="sm" color="gray.400">
              Untuk {totalCount} tiket {type}
            </Text>
          </VStack>

          {/* Form Input Dana */}
          <FormControl isInvalid={!!error}>
            <FormLabel htmlFor="dana" fontWeight="bold">Masukkan Dana Anda</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.400"
                fontSize="1.2em"
                children="Rp"
              />
              <Input
                id="dana"
                placeholder="Contoh: 1000000"
                value={dana}
                onChange={(e) => setDana(e.target.value)}
                type="number"
                size="lg"
                focusBorderColor="teal.400"
              />
            </InputGroup>
          </FormControl>

          {/* Pesan Error */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Tombol Aksi */}
          <VStack spacing={4} mt={4}>
            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              onClick={handleButton}
              isLoading={isLoading}
              loadingText="Memproses..."
              leftIcon={<CheckCircleIcon />}
            >
              Bayar Sekarang
            </Button>

            <Button
              colorScheme="gray"
              size="md"
              variant="ghost" // Desain 'ghost' agar tidak terlalu menonjol
              onClick={() => navigate("/menu")}
            >
              Batal
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default Pembayaran;