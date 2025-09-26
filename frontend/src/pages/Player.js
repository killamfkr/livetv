import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 2000;
  display: flex;
  flex-direction: column;
`;

const PlayerContainer = styled.div`
  flex: 1;
  position: relative;
  background: #000;
`;

const PlayerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 1rem;
  cursor: pointer;
  position: relative;
`;

const Progress = styled.div`
  height: 100%;
  background: #ff6b6b;
  border-radius: 2px;
  width: ${props => props.progress}%;
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 0.9rem;
  min-width: 100px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const Player = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: media, isLoading } = useQuery(
    ['media', type, id],
    () => {
      if (type === 'live-tv') {
        return api.get(`/live-tv/channels/${id}`).then(res => res.data);
      } else {
        return api.get(`/media/${id}`).then(res => res.data);
      }
    },
    { enabled: !!id }
  );

  const getStreamUrl = () => {
    if (type === 'live-tv') {
      return `/api/live-tv/channels/${id}/stream`;
    } else {
      return `/api/media/${id}/stream`;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setPlaying(!playing);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [playing, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (!media) {
    return (
      <Container>
        <div>Media not found</div>
      </Container>
    );
  }

  return (
    <Container>
      <CloseButton onClick={() => navigate(-1)}>
        ✕
      </CloseButton>
      
      <PlayerContainer
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <PlayerWrapper>
          <ReactPlayer
            url={getStreamUrl()}
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            onDuration={handleDuration}
            width="100%"
            height="100%"
            config={{
              file: {
                attributes: {
                  crossOrigin: 'anonymous'
                }
              }
            }}
          />
        </PlayerWrapper>

        <Controls show={showControls}>
          <ControlButton onClick={() => setPlaying(!playing)}>
            {playing ? <FaPause /> : <FaPlay />}
          </ControlButton>

          <ProgressBar>
            <Progress progress={progress} />
          </ProgressBar>

          <TimeDisplay>
            {formatTime(duration * progress / 100)} / {formatTime(duration)}
          </TimeDisplay>

          <ControlButton onClick={() => setMuted(!muted)}>
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </ControlButton>

          <ControlButton onClick={toggleFullscreen}>
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </ControlButton>
        </Controls>
      </PlayerContainer>
    </Container>
  );
};

export default Player;
