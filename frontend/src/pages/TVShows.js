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

const TVShows = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data: tvShows, isLoading, error } = useQuery(
    ['tv-shows', search, page],
    () => api.get(`/media?media_type=tv_show&search=${search}&skip=${page * 20}&limit=20`).then(res => res.data),
    { 
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true
    }
  );

  if (error) {
    return (
      <Container>
        <Title>TV Shows</Title>
        <p>Error loading TV shows. Please try again.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📺 TV Shows</Title>
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search TV shows..." 
        />
      </Header>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <MediaGrid media={tvShows || []} type="tv_show" />
      )}
    </Container>
  );
};

export default TVShows;
