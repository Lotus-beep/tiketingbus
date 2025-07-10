import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import {
  Box,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Heading,
  Divider,
  Badge,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const TiketCardList = ({ data }) => {
  const refs = useRef([]);
  
  // Colors
  const headerBg = useColorModeValue("blue.600", "blue.800");
  const headerText = useColorModeValue("white", "gray.100");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  const generateQRValue = (ticketData) => {
    return JSON.stringify({
      bookingCode: ticketData.kode_pesanan,
      passenger: ticketData.pesanan_tikets,
      seat: ticketData.no_bangku,
      route: ticketData.tiketbus,
      departure: `${ticketData.tanggal} ${ticketData.waktu_berangkat}`,
      type: ticketData.type_tiket
    });
  };

  const handleDownload = async (index) => {
    const element = refs.current[index];
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `tiket_${data[index].kode_pesanan}.png`;
      link.click();
    }
  };

  return (
    <VStack spacing={8} mt={8} px={4} maxW="1200px" mx="auto">
      <Heading size="xl" textAlign="center" color={accentColor}>
        E-Ticket Booking
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
        {data.map((item, index) => (
          <Box
            key={index}
            ref={(el) => (refs.current[index] = el)}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            boxShadow="lg"
            p={0}
            bg={cardBg}
            overflow="hidden"
            position="relative"
          >
            {/* Ticket Header */}
            <Flex
              bg={headerBg}
              color={headerText}
              px={6}
              py={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="xl" fontWeight="bold">
                BUS TICKET
              </Text>
              <Badge colorScheme="yellow" px={2} py={1} borderRadius="md">
                {item.type_tiket}
              </Badge>
            </Flex>

            {/* Ticket Body */}
            <VStack align="stretch" spacing={4} p={6}>
              {/* Booking Info */}
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Booking Code
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                    {item.kode_pesanan}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    {new Date().toLocaleDateString()}
                  </Text>
                </VStack>
                <Box
                  border="2px dashed"
                  borderColor={borderColor}
                  borderRadius="full"
                  p={2}
                >
                  <Box
                    w="80px"
                    h="80px"
                    bg="white"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={1}
                  >
                    <QRCodeSVG
                      value={generateQRValue(item)}
                      size={70}
                      level="H"
                      includeMargin={false}
                      fgColor="#2D3748"
                      bgColor="#FFFFFF"
                    />
                  </Box>
                </Box>
              </Flex>

              <Divider borderColor={borderColor} />

              {/* Passenger Info */}
              <VStack align="stretch" spacing={3}>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  Passenger Information
                </Text>
                <Flex justify="space-between">
                  <Text color="gray.600">Name:</Text>
                  <Text fontWeight="medium">{item.pesanan_tikets}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Seat:</Text>
                  <Text fontWeight="medium">{item.no_bangku}</Text>
                </Flex>
              </VStack>

              <Divider borderColor={borderColor} />

              {/* Trip Info */}
              <VStack align="stretch" spacing={3}>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  Trip Details
                </Text>
                <Flex justify="space-between">
                  <Text color="gray.600">Route:</Text>
                  <Text fontWeight="medium" textAlign="right">
                    {item.tiketbus}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Departure:</Text>
                  <Text fontWeight="medium">
                    {item.tanggal} at {item.waktu_berangkat}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Departure Time:</Text>
                  <Text fontWeight="medium">{item.waktu}</Text>
                </Flex>
              </VStack>

              {/* Footer */}
              <Box mt={4} pt={4} borderTop="1px dashed" borderColor={borderColor}>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Please present this ticket when boarding
                </Text>
                <Text fontSize="xs" color="gray.400" textAlign="center" mt={1}>
                  Scan QR code for verification
                </Text>
              </Box>
            </VStack>

            {/* Watermark */}
            <Text
              position="absolute"
              bottom={4}
              right={4}
              fontSize="xs"
              color="gray.400"
            >
              Powered by YourBus
            </Text>

            {/* Download Button (outside the ticket design) */}
            <Box p={4} bg="gray.50" borderTopWidth="1px" borderTopColor={borderColor}>
              <Button
                w="full"
                colorScheme="blue"
                onClick={() => handleDownload(index)}
                size="sm"
              >
                Download Ticket
              </Button>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default TiketCardList;