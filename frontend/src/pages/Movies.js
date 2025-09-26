import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import MediaGrid from '../components/MediaGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Movies = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data: movies, isLoading, error } = useQuery(
    ['movies', search, page],
    () => api.get(`/media?media_type=movie&search=${search}&skip=${page * 20}&limit=20`).then(res => res.data),
    { 
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true
    }
  );

  if (error) {
    return (
      <Container>
        <Title>Movies</Title>
        <p>Error loading movies. Please try again.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🎬 Movies</Title>
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search movies..." 
        />
      </Header>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <MediaGrid media={movies || []} type="movie" />
      )}
    </Container>
  );
};

export default Movies;
