import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Heading,
  Badge,
  VStack,
  IconButton,
  Image,
  useToast,
} from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";

const BookmarkScreen = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchBookmarks = () => {
      const bookmarkedPokemons = Object.entries(localStorage)
        .map(([key, value]) => {
          let parsedPokemon;
          try {
            parsedPokemon = JSON.parse(value);
          } catch (error) {
            console.error(`Error parsing bookmarked Pokémon ${key}:`, error);
            return null;
          }
          return {
            name: parsedPokemon.name,
            abilities: parsedPokemon.abilities,
            types: parsedPokemon.types,
            image:
              parsedPokemon.sprites.other["official-artwork"].front_default,
          };
        })
        .filter((pokemon) => pokemon !== null);

      setBookmarks(bookmarkedPokemons);
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = (pokemonName) => {
    localStorage.removeItem(pokemonName);
    setBookmarks((prevBookmarks) =>
      prevBookmarks.filter((pokemon) => pokemon.name !== pokemonName)
    );
    toast({
      title: `${pokemonName} removed from bookmarks`,
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Center mt={8}>
      <Box w="70%">
        <Heading as="h1" mb={4}>
          Bookmarks
        </Heading>
        {bookmarks.length > 0 ? (
          <VStack spacing={4} align="start">
            {bookmarks.map((pokemon) => (
              <Box
                key={pokemon.name}
                w="100%"
                p={4}
                borderRadius="md"
                boxShadow="lg"
                bg="white"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Heading
                    as="h2"
                    fontSize="xl"
                    textTransform="capitalize"
                    mb={2}
                  >
                    {pokemon.name}
                  </Heading>
                  <IconButton
                    icon={<AiFillDelete size={20} color="red.400" />}
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => handleRemoveBookmark(pokemon.name)}
                  />
                </Box>
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  boxSize="100px"
                  mb={4}
                />
                <Box>
                  <Heading as="h3" fontSize="md" mb={2}>
                    Abilities
                  </Heading>
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
                  <Heading as="h3" fontSize="md" mb={2}>
                    Types
                  </Heading>
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
              </Box>
            ))}
          </VStack>
        ) : (
          <Box p={4} borderRadius="md" boxShadow="lg" bg="white">
            <Heading as="h2" fontSize="xl">
              No bookmarks found
            </Heading>
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default BookmarkScreen;
