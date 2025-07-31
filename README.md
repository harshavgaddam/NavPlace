# 🧭 NavPlace - AI-Powered Travel Route Planner

A modern web application that transforms every car journey into an adventure with AI-powered personalized recommendations. Discover amazing places along your route based on your interests and preferences.

## ✨ Features

### 🎯 MVP Features (Current)
- **Smart Route Planning** - Google Maps integration with real-time directions
- **Multiple Transportation Modes** - Support for car, transit, walking, and bicycling routes
- **Autocomplete Search** - Intelligent location search with Google Places API
- **POI Discovery** - Find restaurants, museums, parks, and attractions along your route
- **Interest-Based Filtering** - Personalized recommendations based on user preferences
- **Interactive Map** - Visual route display with POI markers and mode-specific colors
- **Modern UI/UX** - Beautiful, responsive design with light/dark theme support
- **Real-time Data** - Live place information, ratings, and opening hours

### 🚀 Planned Features
- **LLM Integration** - AI-powered POI classification and recommendations
- **Event Integration** - Real-time events and activities near POIs
- **Advanced Filtering** - Detour distance, time budget, and category filters
- **User Profiles** - Save preferences and favorite routes
- **Mobile App** - React Native companion app
- **Social Features** - Share routes and discover community recommendations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI) v5** for UI components
- **Framer Motion** for animations
- **React Router v6** for navigation
- **Leaflet** for map display

### APIs & Services
- **Google Maps JavaScript API** - Directions, Places, Geocoding
- **Google Places API** - POI search and details
- **Google Directions API** - Route planning

### Development
- **TypeScript** for type safety
- **CSS Variables** for theming
- **Responsive Design** for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google Maps API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd NavPlace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Google Maps API

#### Get Your API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

#### Set Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📱 Usage

### Planning a Route
1. **Enter Start Location** - Type and select from autocomplete suggestions
2. **Enter Destination** - Type and select from autocomplete suggestions
3. **Select Transportation Mode** - Choose between car, transit, walking, or bicycling
4. **Plan Route** - Click to get directions and discover POIs
5. **Explore POIs** - Browse recommended places along your route
6. **View Details** - Click on POIs for more information

### Setting Preferences
1. Navigate to **Preferences** page
2. **Select Interests** - Choose from categories like history, art, food, nature
3. **Adjust Settings** - Set maximum detour distance and other preferences
4. **Save Preferences** - Your choices will influence POI recommendations

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header with theme toggle
│   ├── ThemeToggle.tsx # Light/dark mode toggle
│   └── ...
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Landing page
│   ├── RoutePlanner.tsx # Route planning interface
│   └── Preferences.tsx # User preferences
├── services/           # API and external services
│   └── GoogleMapsService.ts # Google Maps integration
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── styles/             # Global styles and CSS variables
└── types/              # TypeScript type definitions
```

## 🎨 Theming

The application supports both light and dark themes with:
- **CSS Variables** for dynamic color switching
- **Material-UI Theme Provider** for component theming
- **Smooth Transitions** between theme changes
- **Persistent Preferences** stored in localStorage

## 🔧 Configuration

### Environment Variables
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Google Maps API key (required)

### Customization
- **Colors**: Modify CSS variables in `src/index.css`
- **POI Types**: Update place types in `RoutePlanner.tsx`
- **Search Radius**: Adjust `maxDistance` parameter in POI search

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel** - Recommended for React apps
- **Netlify** - Easy deployment with Git integration
- **Firebase Hosting** - Google's hosting solution
- **AWS S3 + CloudFront** - Scalable static hosting

### Environment Setup for Production
1. Set up environment variables in your hosting platform
2. Configure domain restrictions for Google Maps API key
3. Enable HTTPS for API calls

## 🔮 Roadmap

### Phase 2 - Enhanced Features
- [ ] LLM integration for intelligent POI classification
- [ ] Event integration (Eventbrite, Ticketmaster)
- [ ] Advanced route optimization
- [ ] User authentication and profiles
- [ ] Route sharing and social features

### Phase 3 - Mobile & Advanced
- [ ] React Native mobile app
- [ ] Offline route caching
- [ ] Voice navigation integration
- [ ] AR features for POI discovery
- [ ] Community-driven recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps Platform** for mapping and location services
- **Material-UI** for the beautiful component library
- **Framer Motion** for smooth animations
- **React Community** for the amazing ecosystem

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Made with ❤️ for travelers who love to discover amazing places along their journey.** 