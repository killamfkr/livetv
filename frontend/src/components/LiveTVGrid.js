import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay, FaBroadcastTower, FaGlobe } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

const ChannelCard = styled(Link)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LogoContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultLogo = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const ChannelInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChannelName = styled.h3`
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ChannelMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.8rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PlayButton = styled.div`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6b6b;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;

  ${ChannelCard}:hover & {
    background: #ff6b6b;
    color: white;
  }
`;

const LiveTVGrid = ({ channels }) => {
  return (
    <Grid>
      {channels.map((channel) => (
        <ChannelCard key={channel.id} to={`/player/live-tv/${channel.id}`}>
          <LogoContainer>
            {channel.logo_url ? (
              <Logo 
                src={channel.logo_url} 
                alt={channel.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <DefaultLogo>
                <FaBroadcastTower />
              </DefaultLogo>
            )}
          </LogoContainer>
          
          <ChannelInfo>
            <ChannelName>{channel.name}</ChannelName>
            <ChannelMeta>
              {channel.category && (
                <MetaItem>{channel.category}</MetaItem>
              )}
              {channel.language && (
                <MetaItem>
                  <FaGlobe />
                  {channel.language}
                </MetaItem>
              )}
              {channel.country && (
                <MetaItem>{channel.country}</MetaItem>
              )}
            </ChannelMeta>
          </ChannelInfo>

          <PlayButton>
            <FaPlay />
          </PlayButton>
        </ChannelCard>
      ))}
    </Grid>
  );
};

export default LiveTVGrid;
