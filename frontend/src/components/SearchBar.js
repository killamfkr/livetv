import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #333;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }

  &::placeholder {
    color: #666;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1rem;
`;

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <Container>
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Container>
  );
};

export default SearchBar;
