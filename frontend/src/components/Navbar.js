import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaHome, FaFilm, FaTv, FaBroadcastTower, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #333;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b6b;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: calc(100vh - 80px);
    background: rgba(0, 0, 0, 0.98);
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 2rem;
    transition: left 0.3s ease;
  }
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ff6b6b;
  }

  &.active {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
`;

const LogoutButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: #ff5252;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Nav>
      <Logo to="/">
        <FaBroadcastTower />
        LiveTV
      </Logo>

      <NavLinks isOpen={isOpen}>
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          <FaHome />
          Home
        </NavLink>
        <NavLink to="/movies" onClick={() => setIsOpen(false)}>
          <FaFilm />
          Movies
        </NavLink>
        <NavLink to="/tv-shows" onClick={() => setIsOpen(false)}>
          <FaTv />
          TV Shows
        </NavLink>
        <NavLink to="/live-tv" onClick={() => setIsOpen(false)}>
          <FaBroadcastTower />
          Live TV
        </NavLink>
        <NavLink to="/settings" onClick={() => setIsOpen(false)}>
          <FaCog />
          Settings
        </NavLink>
      </NavLinks>

      <UserMenu>
        <UserInfo>
          <span>Welcome, {user?.username}</span>
        </UserInfo>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutButton>
        <MobileMenuButton onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </UserMenu>
    </Nav>
  );
};

export default Navbar;
