![Windows 11 Portfolio](public/other/readme-banner.webp)

# Windows 11 Portfolio

A modern, interactive portfolio website built with Next.js and React that mimics the Windows 11 desktop experience. This project showcases a developer's skills, projects, and experience through an intuitive and engaging Windows 11-inspired interface.

## Features

- **Windows 11 Desktop Experience**: Complete with draggable windows, taskbar, desktop icons, and system UI
- **Interactive Applications**: Multiple "applications" to showcase different aspects of the portfolio:
  - Text Editor: Introduction and welcome message
  - About: Personal information and background
  - Projects: Showcase of development projects
  - Resume: Professional experience and skills
  - Contact: Email contact form
  - Spotify: Music player that uses spotify's API
  - ChatGPT: Context aware chatbot
  - Comments: User comments about the site
  - VS Code: Code repository viewer
  - Google: Search functionality
- **Responsive Design**: Adapts to different screen sizes while maintaining the Windows 11 look and feel
- **Theme Support**: Light and dark mode support
- **Sound Effects**: Optional UI sound effects for enhanced interaction
- **AI Integration**: Powered by Vercel's AI SDK for enhanced user interactions and chatbot functionality

## Technologies Used

- **Frontend**:

  - Next.js 15.3
  - React 19
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - React-RND (resizable and draggable windows)
  - Howler.js (sound effects)
  - Vercel AI SDK (AI-powered features)

- **Development Tools**:
  - ESLint
  - TypeScript
  - Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn or pnpm or bun

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/achen2304/windows11-portfolio.git
   cd windows11-portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Main application pages and layout
- `src/components`: UI components (windows, taskbar, desktop elements)
- `src/data`: Content data (projects, skills, experience)
- `src/lib`: Utility functions and theme configuration
- `public`: Static assets (images, icons)

## Deployment

The easiest way to deploy your Windows 11 Portfolio is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Design inspired by Microsoft's Windows 11 UI
- App designs inspired by their respective apps UI
- Created by Cai Chen
