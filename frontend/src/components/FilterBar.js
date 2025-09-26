import React from 'react';
import styled from 'styled-components';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const ClearButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #333;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FilterBar = ({ 
  category, 
  setCategory, 
  language, 
  setLanguage, 
  country, 
  setCountry,
  categories = [],
  languages = [],
  countries = []
}) => {
  const hasFilters = category || language || country;

  const clearFilters = () => {
    setCategory('');
    setLanguage('');
    setCountry('');
  };

  return (
    <Container>
      <FilterGroup>
        <Label>Category</Label>
        <Select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Language</Label>
        <Select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Country</Label>
        <Select 
          value={country} 
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </Select>
      </FilterGroup>

      {hasFilters && (
        <ClearButton onClick={clearFilters}>
          <FaTimes />
          Clear Filters
        </ClearButton>
      )}
    </Container>
  );
};

export default FilterBar;
