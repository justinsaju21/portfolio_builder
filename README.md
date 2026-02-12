# 🚀 PortfolioHub

**Create stunning student portfolios in minutes, not hours.**

PortfolioHub is a multi-tenant portfolio platform that lets students create and host professional portfolios without any coding knowledge. Each user gets a unique URL at `your-domain.com/username`.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)

## ✨ Features

- **⚡ Lightning Fast Setup** - Create a portfolio in under 5 minutes
- **🌐 Instant Hosting** - Your portfolio goes live immediately at a unique URL
- **🎨 Beautiful Design** - Modern, responsive templates with glassmorphism effects
- **📊 Google Sheets Backend** - Easy-to-manage data storage with familiar interface
- **📤 Export Your Data** - Download your portfolio data as JSON anytime
- **📱 Mobile Responsive** - Looks great on all devices
- **🔒 Simple Auth** - Username + PIN login (no email required)

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 + Framer Motion
- **Database**: Google Sheets (via `google-spreadsheet`)
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Google Cloud account (for Google Sheets API)

### Installation

1. **Clone the repository**
   ```bash
   cd portfolio-platform
   npm install
   ```

2. **Set up Google Sheets API** (see [Google Sheets Setup Guide](#-google-sheets-setup))

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Google credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📊 Google Sheets Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create a Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "portfolio-bot")
4. Click "Create and Continue"
5. Skip the optional steps, click "Done"
6. Click on the service account you just created
7. Go to "Keys" tab > "Add Key" > "Create new key"
8. Choose "JSON" and download the file

### Step 3: Create Your Google Sheet

Create a new Google Sheet with the following tabs (worksheets):

#### Tab: `Users`
| username | password_pin | full_name | tagline | email | github | linkedin | bio | degree | university | graduation_year | theme_preference | profile_image |
|----------|--------------|-----------|---------|-------|--------|----------|-----|--------|------------|-----------------|------------------|---------------|

#### Tab: `Experience`
| username | title | company | location | start_date | end_date | is_current | description_points | type |
|----------|-------|---------|----------|------------|----------|------------|-------------------|------|

#### Tab: `Projects`
| username | title | description | tech_stack | repo_url | live_url | image_url | featured |
|----------|-------|-------------|------------|----------|----------|-----------|----------|

#### Tab: `Skills`
| username | category | skills_list |
|----------|----------|-------------|

#### Tab: `Education`
| username | degree | field | institution | year | is_current |
|----------|--------|-------|-------------|------|------------|

### Step 4: Share the Sheet

1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (from the JSON file, looks like `name@project.iam.gserviceaccount.com`)
4. Give it "Editor" access

### Step 5: Configure Environment Variables

Add these to your `.env.local`:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id-from-url
```

**Note:** The sheet ID is the long string in your Google Sheet URL:
`https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`

## 📁 Project Structure

```
portfolio-platform/
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Landing page
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Login/signup endpoints
│   │   │   ├── user/           # User data endpoints
│   │   │   └── export/         # Data export endpoint
│   │   ├── dashboard/          # User dashboard
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── [username]/         # Dynamic portfolio pages
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── landing/            # Landing page components
│   │   ├── layout/             # Navbar, Footer
│   │   ├── portfolio/          # Portfolio view components
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       ├── google-sheets.ts    # Google Sheets integration
│       ├── types.ts            # TypeScript types
│       └── utils.ts            # Utility functions
├── .env.example                # Environment template
├── package.json
└── README.md
```

## 🎯 How It Works

1. **User Signs Up**: Creates account with username + PIN
2. **Data Stored**: Profile saved to Google Sheets
3. **Portfolio Generated**: Dynamic page at `/username` renders their data
4. **User Edits**: Dashboard allows updating profile info
5. **Export**: Users can download their data as JSON

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted

## 📝 Data Format Notes

- **Lists**: Use comma-separated values (e.g., `React, Node.js, Python`)
- **Description Points**: Use pipe `|` separator (e.g., `Built API | Designed UI | Led team`)
- **Booleans**: Use `TRUE` or `FALSE` (case-insensitive)
- **URLs**: Include full URL or just username for social links

## 🔮 Future Improvements

- [ ] Full CRUD for Experience/Projects/Skills in Dashboard
- [ ] Multiple theme options
- [ ] Custom domain support
- [ ] Image uploads
- [ ] PDF resume generation
- [ ] Analytics dashboard

## 📄 License

MIT License - feel free to use this for your own projects!

---

Made with ❤️ for students everywhere
