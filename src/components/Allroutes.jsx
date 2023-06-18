import React from "react";
import SearchPage from "./SearchPage";
import ListingPage from "./ListingPage";
import DetailsPage from "./DetailsPage";
import BookmarkScreen from "./BookmarkScreen";
import { Route, Routes } from "react-router-dom";

const Allroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/listing" element={<ListingPage />} />
      <Route path="/details/:id" element={<DetailsPage />} />
      <Route path="/bookmarks" element={<BookmarkScreen />} />
    </Routes>
  );
};

export default Allroutes;
