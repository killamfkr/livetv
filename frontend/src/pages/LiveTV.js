import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import LiveTVGrid from '../components/LiveTVGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

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

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const LiveTV = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');

  const { data: channels, isLoading, error } = useQuery(
    ['live-channels', search, category, language, country],
    () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (language) params.append('language', language);
      if (country) params.append('country', country);
      
      return api.get(`/live-tv/channels?${params.toString()}`).then(res => res.data);
    },
    { staleTime: 2 * 60 * 1000 }
  );

  const { data: categories } = useQuery(
    'categories',
    () => api.get('/live-tv/categories').then(res => res.data),
    { staleTime: 10 * 60 * 1000 }
  );

  const { data: languages } = useQuery(
    'languages',
    () => api.get('/live-tv/languages').then(res => res.data),
    { staleTime: 10 * 60 * 1000 }
  );

  const { data: countries } = useQuery(
    'countries',
    () => api.get('/live-tv/countries').then(res => res.data),
    { staleTime: 10 * 60 * 1000 }
  );

  if (error) {
    return (
      <Container>
        <Title>Live TV</Title>
        <p>Error loading channels. Please try again.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📡 Live TV</Title>
        <Controls>
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search channels..." 
          />
          <FilterBar
            category={category}
            setCategory={setCategory}
            language={language}
            setLanguage={setLanguage}
            country={country}
            setCountry={setCountry}
            categories={categories || []}
            languages={languages || []}
            countries={countries || []}
          />
        </Controls>
      </Header>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <LiveTVGrid channels={channels || []} />
      )}
    </Container>
  );
};

export default LiveTV;
