import React, { useState } from "react";
import { Box, Input, Button, Text, Spinner, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!pokemonName) {
      setError("Please enter a Pokemon name.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Make API call to search endpoint
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      if (response.ok) {
        const pokemonData = await response.json();
        console.log(pokemonData);
        navigate(`/listing?name=${pokemonName}`);
      } else {
        setError("Pokemon not found.");
      }
    } catch (error) {
      setError("An error occurred while fetching the Pokemon data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxWidth="400px"
      margin="auto"
      mt={8}
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="lg"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
        Search Pokemon
      </Text>
      <Flex mb={4}>
        <Input
          placeholder="Enter Pokemon name"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleSearch} ml={2}>
          Search
        </Button>
      </Flex>
      {isLoading && (
        <Flex justify="center">
          <Spinner size="md" />
        </Flex>
      )}
      {error && (
        <Box mt={4}>
          <Text color="red" textAlign="center">
            {error}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
