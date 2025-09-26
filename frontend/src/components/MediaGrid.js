import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay, FaClock, FaStar } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

const MediaCard = styled(Link)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  group: hover;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  background: #333;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 1.5rem;

  ${MediaCard}:hover & {
    opacity: 1;
  }
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
`;

const MediaGrid = ({ media, type }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Grid>
      {media.map((item) => (
        <MediaCard key={item.id} to={`/player/${type}/${item.id}`}>
          <ThumbnailContainer>
            {item.thumbnail_path ? (
              <Thumbnail 
                src={`/api/media/${item.id}/thumbnail`} 
                alt={item.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #333, #555)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '3rem'
              }}>
                {type === 'movie' ? '🎬' : type === 'tv_show' ? '📺' : '🎵'}
              </div>
            )}
            <PlayOverlay>
              <FaPlay />
            </PlayOverlay>
          </ThumbnailContainer>
          <Content>
            <Title>{item.title}</Title>
            <Meta>
              {item.year && <MetaItem>{item.year}</MetaItem>}
              {item.duration && (
                <MetaItem>
                  <FaClock />
                  {formatDuration(item.duration)}
                </MetaItem>
              )}
              {item.rating && (
                <Rating>
                  <FaStar />
                  {item.rating.toFixed(1)}
                </Rating>
              )}
            </Meta>
          </Content>
        </MediaCard>
      ))}
    </Grid>
  );
};

export default MediaGrid;
