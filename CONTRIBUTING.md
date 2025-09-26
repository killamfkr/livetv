# Contributing to LiveTV

Thank you for your interest in contributing to LiveTV! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Git
- Basic knowledge of Python (FastAPI) and React

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/livetv.git
   cd livetv
   ```
3. Run the setup script:
   ```bash
   ./setup.sh  # Linux/macOS
   setup.bat   # Windows
   ```
4. Start development services:
   ```bash
   docker-compose up -d
   ```

## 🛠️ Development Guidelines

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript/React**: Use ESLint configuration
- **CSS**: Use styled-components for styling
- **Commits**: Use conventional commit messages

### Project Structure
```
livetv/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── nginx/           # Nginx configuration
├── media/           # Media files (not tracked)
├── config/          # Configuration files
└── docker-compose.yml
```

### Backend Development
- Use FastAPI best practices
- Add type hints to all functions
- Write docstrings for all public functions
- Use SQLAlchemy for database operations
- Add proper error handling

### Frontend Development
- Use functional components with hooks
- Implement responsive design
- Use styled-components for styling
- Add proper error boundaries
- Implement loading states

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Aim for >80% test coverage
- Test all API endpoints
- Test critical user flows
- Test error scenarios

## 📝 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description
   - Link any related issues
   - Add screenshots for UI changes

## 🐛 Bug Reports

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- System information (OS, Docker version, etc.)

## ✨ Feature Requests

When requesting features, please include:
- Clear description of the feature
- Use case and motivation
- Mockups or examples (if applicable)
- Any implementation ideas

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed

## 🔒 Security

- **Never commit sensitive data** (passwords, API keys, etc.)
- Report security vulnerabilities privately
- Use environment variables for configuration
- Follow security best practices

## 📚 Documentation

- Update README.md for significant changes
- Add inline code comments
- Update API documentation
- Include setup instructions for new features

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Security improvements
- Mobile responsiveness
- Accessibility features
- Error handling

### Medium Priority
- Additional media formats
- Plugin system
- Advanced search
- User preferences
- Analytics

### Low Priority
- Themes and customization
- Advanced player features
- Social features
- Mobile apps

## 💬 Communication

- Use GitHub Issues for discussions
- Be respectful and constructive
- Help others when possible
- Ask questions if unsure

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to LiveTV! 🎉
