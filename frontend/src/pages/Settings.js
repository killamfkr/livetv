import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaUpload, FaPlus, FaTrash, FaRefresh } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ffffff;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PlaylistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PlaylistItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PlaylistName = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
`;

const PlaylistType = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const PlaylistActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#ff4757' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.danger ? '#ff3742' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const Settings = () => {
  const { user } = useAuth();
  const [playlistName, setPlaylistName] = useState('');
  const [xtreamUrl, setXtreamUrl] = useState('');
  const [xtreamUsername, setXtreamUsername] = useState('');
  const [xtreamPassword, setXtreamPassword] = useState('');

  const handleM3UUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', playlistName);
    formData.append('playlist_type', 'm3u');

    try {
      // This would be implemented with actual API call
      toast.success('M3U playlist uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload playlist');
    }
  };

  const handleXtreamAdd = async (e) => {
    e.preventDefault();
    
    try {
      // This would be implemented with actual API call
      toast.success('Xtream Codes playlist added successfully!');
      setXtreamUrl('');
      setXtreamUsername('');
      setXtreamPassword('');
    } catch (error) {
      toast.error('Failed to add Xtream Codes playlist');
    }
  };

  return (
    <Container>
      <Title>⚙️ Settings</Title>

      <Section>
        <SectionTitle>User Information</SectionTitle>
        <p>Username: {user?.username}</p>
        <p>Email: {user?.email}</p>
        <p>Admin: {user?.is_admin ? 'Yes' : 'No'}</p>
      </Section>

      {user?.is_admin && (
        <>
          <Section>
            <SectionTitle>M3U Playlist Upload</SectionTitle>
            <Form onSubmit={handleM3UUpload}>
              <InputGroup>
                <Label htmlFor="playlist-name">Playlist Name</Label>
                <Input
                  id="playlist-name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="m3u-file">M3U File</Label>
                <Input
                  id="m3u-file"
                  type="file"
                  accept=".m3u,.m3u8"
                  onChange={handleM3UUpload}
                  required
                />
              </InputGroup>
              <Button type="submit">
                <FaUpload />
                Upload M3U Playlist
              </Button>
            </Form>
          </Section>

          <Section>
            <SectionTitle>Xtream Codes Integration</SectionTitle>
            <Form onSubmit={handleXtreamAdd}>
              <InputGroup>
                <Label htmlFor="xtream-url">Server URL</Label>
                <Input
                  id="xtream-url"
                  value={xtreamUrl}
                  onChange={(e) => setXtreamUrl(e.target.value)}
                  placeholder="http://example.com:port"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="xtream-username">Username</Label>
                <Input
                  id="xtream-username"
                  value={xtreamUsername}
                  onChange={(e) => setXtreamUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="xtream-password">Password</Label>
                <Input
                  id="xtream-password"
                  type="password"
                  value={xtreamPassword}
                  onChange={(e) => setXtreamPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </InputGroup>
              <Button type="submit">
                <FaPlus />
                Add Xtream Codes
              </Button>
            </Form>
          </Section>

          <Section>
            <SectionTitle>Manage Playlists</SectionTitle>
            <PlaylistList>
              <PlaylistItem>
                <PlaylistInfo>
                  <PlaylistName>Sample M3U Playlist</PlaylistName>
                  <PlaylistType>M3U • 150 channels</PlaylistType>
                </PlaylistInfo>
                <PlaylistActions>
                  <ActionButton>
                    <FaRefresh />
                    Refresh
                  </ActionButton>
                  <ActionButton danger>
                    <FaTrash />
                    Delete
                  </ActionButton>
                </PlaylistActions>
              </PlaylistItem>
            </PlaylistList>
          </Section>
        </>
      )}
    </Container>
  );
};

export default Settings;
