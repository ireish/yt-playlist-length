# YouTube Playlist Length Calculator

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.x-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A modern web application that calculates the total length of a YouTube playlist, allowing users to adjust playback speed to see how long it would take to watch the entire playlist.

![YouTube Playlist Length Calculator]

## 🌟 Features

- Enter any YouTube playlist URL and get detailed information about the playlist
- View total duration of the playlist at normal speed (1x)
- Adjust playback speed (1.00x to 2.00x) and see updated duration
- Browse all videos in the playlist with pagination
- Dark mode theme for comfortable viewing
- Responsive design that works on desktop and mobile devices

## 🛠️ Tech Stack

- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API requests
- **YouTube Data API v3**: For fetching playlist metadata

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16+)
- npm or yarn
- A Google API key with YouTube Data API v3 enabled

## 🚀 Installation

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
3. Create a `.env` file in the `client` directory with your YouTube API key:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

## 🏃‍♂️ Running the Application

### Start the Backend Server

```bash
cd server
# Make sure your virtual environment is activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

### Start the Frontend Development Server

```bash
cd client
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173

## 📱 Usage

1. Open your browser and navigate to http://localhost:5173
2. Enter a YouTube playlist URL (e.g., https://www.youtube.com/playlist?list=PLAYLIST_ID)
3. Click "Load Playlist" to fetch the playlist information
4. View the total duration and adjust the playback speed using the slider
5. Browse through the videos in the playlist
6. Click "Load More" to see additional videos if the playlist has more than 20 videos

## 🔌 API Endpoints

The backend provides the following endpoints:

- `GET /api/playlist/{playlist_id}` - Get basic playlist information
- `GET /api/playlist/{playlist_id}/videos` - Get videos from the playlist with pagination
- `GET /api/playlist/{playlist_id}/duration` - Get the total duration of the playlist
- `GET /api/playlist-url?url={playlist_url}` - Process a full YouTube URL


## 🧰 Project Structure

```
yt-playlist-length/
├── client/                   # React frontend (Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/            # Utility functions and types
│   │   ├── styles/           # CSS and theme files
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- ## 🙏 Acknowledgements

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/) -->
