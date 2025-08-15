# YouTube Playlist Length Calculator

[![Next.js](https://img.shields.io/badge/Next.js-14.x-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A modern web application that calculates the total length of a YouTube playlist, allowing users to adjust playback speed to see how long it would take to watch the entire playlist.

![YouTube Playlist Length Calculator]

## 🌟 Features

- Enter any YouTube playlist URL and get detailed information about the playlist
- View total duration of the playlist at normal speed (1x)
- Adjust playback speed (1.00x to 2.00x) and see updated duration
- Dark mode theme for comfortable viewing
- Responsive design that works on desktop and mobile devices

## 🛠️ Tech Stack

- **Next.js**: React framework for building full-stack web applications.
- **TypeScript**: Type safety
- **Google APIs Node.js Client**: For fetching playlist metadata from YouTube Data API v3.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.17+)
- npm, yarn, or pnpm
- A Google API key with YouTube Data API v3 enabled

## 🚀 Installation

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
3. Rename the `.env.example` file in the `client` directory to `.env` and paste your YouTube API key:
   ```
   YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
   ```

## 🏃‍♂️ Running the Application

1.  Navigate to the `client` directory if you are not already there.
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
4.  The application will be available at http://localhost:3000

## 📱 Usage

1. Open your browser and navigate to http://localhost:3000
2. Enter a YouTube playlist URL (e.g., https://www.youtube.com/playlist?list=PLAYLIST_ID)
3. Click "Load Playlist" to fetch the playlist information
4. View the total duration and adjust the playback speed using the slider

## 🔌 API Endpoints

The application provides the following API endpoints, which are handled by Next.js API Routes:

- `GET /api/playlist/{playlistId}` - Get basic playlist information.
- `GET /api/playlist/{playlistId}/videos` - Get videos from the playlist with pagination. Supports `pageToken` and `maxResults` query parameters.

## 🧰 Project Structure

```
yt-playlist-length/
└── client/                   # Next.js application
    ├── src/
    │   ├── app/              # App Router: pages and layouts
    │   │   ├── api/          # API routes
    │   │   ├── layout.tsx    # Root layout
    │   │   └── page.tsx      # Main page
    │   ├── components/       # React components
    │   ├── utils/            # Utility functions and types
    │   └── styles/           # Global styles
    ├── public/
    ├── package.json
    ├── next.config.mjs
    └── tsconfig.json
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

## 🙏 Acknowledgements

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
