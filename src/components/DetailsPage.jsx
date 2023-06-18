import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  IconButton,
  useToast,
  Center,
  Image,
  Badge,
  Flex,
  Link,
  Button,
} from "@chakra-ui/react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const DetailsPage = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const pokemonData = response.data;
        setPokemon(pokemonData);
        checkBookmarkStatus(pokemonData.name);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const checkBookmarkStatus = (name) => {
    const isPokemonBookmarked = localStorage.getItem(name);
    setIsBookmarked(!!isPokemonBookmarked);
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      localStorage.removeItem(pokemon.name);
      setIsBookmarked(false);
      toast({
        title: `${pokemon.name} removed from bookmarks`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const pokemonData = JSON.stringify(pokemon);
      localStorage.setItem(pokemon.name, pokemonData);
      setIsBookmarked(true);
      toast({
        title: `${pokemon.name} bookmarked`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      console.log(localStorage);
    }
  };
  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const getRandomGradient = () => {
    const colors = [
      "linear-gradient(to right, #FDC830, #F37335)",
      "linear-gradient(to right, #8E2DE2, #4A00E0)",
      "linear-gradient(to right, #00B4DB, #0083B0)",
      "linear-gradient(to right, #FF512F, #DD2476)",
      "linear-gradient(to right, #EECDA3, #EF629F)",
      "linear-gradient(to right, #11998e, #38ef7d)",
      "linear-gradient(to right, #FBAB7E, #F7CE68)",
      "linear-gradient(to right, #E44D26, #F16529)",
      "linear-gradient(to right, #40E0D0, #FF8C00)",
      "linear-gradient(to right, #3D7EAA, #FFE47A)",
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const gradientBg = getRandomGradient();

  return (
    <Center mt={8}>
      <Box
        w="70%"
        bgGradient={gradientBg}
        borderRadius="md"
        boxShadow="lg"
        overflow="hidden"
        position="relative"
      >
        <IconButton
          icon={
            isBookmarked ? (
              <AiFillStar size={24} color="yellow.400" />
            ) : (
              <AiOutlineStar size={24} color="gray.400" />
            )
          }
          colorScheme="blue"
          variant="ghost"
          position="absolute"
          top={2}
          right={2}
          onClick={handleBookmark}
        />
        <Flex>
          <Box w="50%">
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                boxSize="100%"
                objectFit="cover"
              />
            </motion.div>
          </Box>
          <Box w="60%" p={4} color="white">
            <Text
              fontSize="3xl"
              fontWeight="bold"
              mb={2}
              textTransform="capitalize"
            >
              {pokemon.name}
            </Text>
            <Flex direction="column" mb={4}>
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  Abilities
                </Text>
                {pokemon.abilities.map((ability) => (
                  <Badge
                    key={ability.ability.name}
                    variant="subtle"
                    colorScheme="teal"
                    mb={2}
                  >
                    {ability.ability.name}
                  </Badge>
                ))}
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  Types
                </Text>
                {pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    variant="subtle"
                    colorScheme="teal"
                    mb={2}
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </Box>
            </Flex>
            <Flex justify="space-between">
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  Height
                </Text>
                <Text>{pokemon.height} cm</Text>
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  Weight
                </Text>
                <Text>{pokemon.weight} kg</Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box position="fixed" top={4} right={4}>
        <Button as={Link} href="/bookmarks" colorScheme="teal">
          Go to Bookmarks
        </Button>
      </Box>
    </Center>
  );
};

export default DetailsPage;
