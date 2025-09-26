import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import MediaGrid from '../components/MediaGrid';
import LiveTVGrid from '../components/LiveTVGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Home = () => {
  const { data: recentMovies, isLoading: moviesLoading } = useQuery(
    'recent-movies',
    () => api.get('/media?media_type=movie&limit=8').then(res => res.data),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: recentTVShows, isLoading: tvLoading } = useQuery(
    'recent-tv-shows',
    () => api.get('/media?media_type=tv_show&limit=8').then(res => res.data),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: liveChannels, isLoading: liveLoading } = useQuery(
    'live-channels',
    () => api.get('/live-tv/channels?limit=8').then(res => res.data),
    { staleTime: 2 * 60 * 1000 }
  );

  return (
    <Container>
      <WelcomeMessage>
        <WelcomeTitle>Welcome to LiveTV</WelcomeTitle>
        <WelcomeSubtitle>Your personal media server with live TV support</WelcomeSubtitle>
      </WelcomeMessage>

      <Section>
        <SectionTitle>🎬 Recent Movies</SectionTitle>
        {moviesLoading ? (
          <LoadingSpinner />
        ) : (
          <MediaGrid media={recentMovies || []} type="movie" />
        )}
      </Section>

      <Section>
        <SectionTitle>📺 Recent TV Shows</SectionTitle>
        {tvLoading ? (
          <LoadingSpinner />
        ) : (
          <MediaGrid media={recentTVShows || []} type="tv_show" />
        )}
      </Section>

      <Section>
        <SectionTitle>📡 Live TV Channels</SectionTitle>
        {liveLoading ? (
          <LoadingSpinner />
        ) : (
          <LiveTVGrid channels={liveChannels || []} />
        )}
      </Section>
    </Container>
  );
};

export default Home;
