import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
  useToast,
  Select,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import randomColor from "randomcolor";

const ListingPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const history = useNavigate();
  const toast = useToast();

  const fetchPokemonList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const limit = 10;
      const offset = (pageNumber - 1) * limit;

      let apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

      if (filterOption) {
        apiUrl = `https://pokeapi.co/api/v2/${filterOption}`;
      }

      const response = await fetch(apiUrl);

      if (response.ok) {
        const pokemonData = await response.json();

        if (pokemonData.results) {
          if (pageNumber === 1) {
            setPokemonList(pokemonData.results);
          } else {
            setPokemonList((prevList) => [...prevList, ...pokemonData.results]);
          }
        }

        if (pokemonData.next) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } else {
        setError("Failed to fetch Pokemon list.");
      }
    } catch (error) {
      setError("An error occurred while fetching the Pokemon list.");
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, filterOption]);

  useEffect(() => {
    fetchPokemonList();
  }, [fetchPokemonList]);

  const handleLoadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
    setPageNumber(1);
    setPokemonList([]);
  };

  const handlePokemonClick = (pokemonName) => {
    history(`/details/${pokemonName}`);
  };

  if (isLoading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box mx="auto" maxWidth="800px" p={4}>
      <Box mb={4}>
        <Select
          placeholder="Filter by"
          value={filterOption}
          onChange={handleFilterChange}
          width="200px"
        >
          <option value="ability">Ability</option>
          <option value="characteristic">Characteristic</option>
          <option value="location">Location</option>
          <option value="species">Species</option>
        </Select>
      </Box>
      <SimpleGrid columns={2} spacing={4}>
        {pokemonList.map((pokemon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              borderWidth="2px"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
              onClick={() => handlePokemonClick(pokemon.name)}
              _hover={{ shadow: "md" }}
              p={4}
              bg={randomColor({ luminosity: "light" })}
            >
              <Box
                height="200px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginBottom={4}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                    index + 1
                  }.png`}
                  alt={pokemon.name}
                  style={{ width: "60%" }}
                />
              </Box>
              <Text textAlign="center" fontWeight="bold" fontSize="xl">
                {pokemon.name}
              </Text>
              <Box height="2px" bg="gray.200" my={2} />
              <Text textAlign="center">{pokemon.name}</Text>
            </Box>
          </motion.div>
        ))}
      </SimpleGrid>
      {hasMore && (
        <Box mt={4} display="flex" justifyContent="center">
          <Button colorScheme="blue" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ListingPage;
