# 🫖 SCOBY Pal Quest - Your Kombucha Brewing Companion

A delightful gamified fermentation companion app that helps you track your kombucha brewing journey, care for your virtual SCOBY pet, and complete daily quests while learning the art of kombucha making.

## ✨ Features

### 🎮 Gamified Experience
- **Virtual SCOBY Pet**: Care for your digital SCOBY companion
- **Quest System**: Complete tutorial and challenge quests to earn XP
- **Leveling System**: Progress through brewing levels based on your fermentation experience
- **Achievements**: Unlock titles and rewards as you master kombucha brewing

### 🫖 Batch Management
- **Smart Tracking**: Automatically track brewing days and fermentation progress
- **Batch Lifecycle**: Manage batches from brewing → ready → bottled → archived
- **F2 Fermentation**: Track second fermentation for carbonation and flavoring
- **Batch Statistics**: View comprehensive stats on your brewing history
- **Pin System**: Pin important batches for quick access


### 📚 Knowledge Library
- **Comprehensive Guide**: Learn everything about kombucha brewing
- **Categorized Content**: Browse by basics, brewing, troubleshooting, and advanced topics
- **Search Functionality**: Find specific information quickly
- **Progressive Learning**: Structured modules from beginner to advanced

### 🎯 Quest System
- **Tutorial Quests**: Step-by-step guidance for beginners
- **Challenge Quests**: Ongoing challenges for experienced brewers
- **Reward System**: Earn XP, health points, and unlockable titles
- **Progress Tracking**: Visual progress indicators for all quests

### 📱 Modern Interface
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Intuitive Navigation**: Bottom navigation with 5 main sections
- **Real-time Updates**: Live progress tracking
- **Toast Notifications**: Helpful feedback for all actions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd scoby-pal-quest

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Development Scripts

```sh
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📱 App Structure

### Main Pages
- **🏠 Dashboard**: Overview of your SCOBY's health, active batches, and daily quests
- **🫖 Batches**: Manage all your kombucha batches with detailed tracking
- **🎯 Quests**: Complete tutorial and challenge quests to earn rewards
- **📚 Library**: Comprehensive kombucha knowledge base
- **⚙️ Settings**: Customize your brewing experience

### Key Components
- **SCOBY Avatar**: Your virtual pet with dynamic health visualization
- **Batch Cards**: Detailed batch information with progress tracking
- **Health Ring**: Real-time SCOBY health status with trend indicators
- **Quest Cards**: Interactive quest system with progress tracking
- **Knowledge Modules**: Structured learning content with search functionality

## 🛠️ Technology Stack

### Core Framework
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible React components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable SVG icons
- **Class Variance Authority** - Component variant management

### State Management & Data
- **React Hooks** - Built-in state management with custom hooks
- **Local Storage** - Persistent data storage for batches and settings
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Additional Libraries
- **date-fns** - Modern JavaScript date utility library
- **React Router DOM** - Client-side routing
- **Sonner** - Toast notification system
- **Recharts** - Composable charting library
- **React Query** - Data fetching and caching

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixing

## 🚀 Deployment

This project can be deployed to any static hosting service. Here are the recommended options:

### Recommended Platforms
- **Vercel** (Recommended): Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop your build folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated builds and deployments
- **Firebase Hosting**: Deploy using Firebase CLI with custom domain support

### Build for Production

```sh
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist` directory, ready for deployment.

### Environment Variables
No environment variables are required for basic functionality. All data is stored locally in the browser.

## 📖 Usage Guide

### Getting Started
1. **Create Your First Batch**: Start by creating a new kombucha batch with your preferred tea type
2. **Complete Tutorial Quests**: Follow the guided tutorial to learn the basics
3. **Engage with the App**: Interact daily to maintain your SCOBY's mood and streak
4. **Explore the Library**: Use the knowledge base to learn advanced brewing techniques


### Quest System
- **Tutorial Quests**: Linear progression for beginners
- **Challenge Quests**: Ongoing challenges for experienced brewers
- Complete quests to earn XP and unlockable titles

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the kombucha brewing community
- Built with love for fermentation enthusiasts
- Special thanks to all beta testers and contributors
