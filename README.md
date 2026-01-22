# LedgerSync - Smart Crypto & Finance Dashboard

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

LedgerSync is a comprehensive financial dashboard application that allows users to track global stocks, cryptocurrencies, and Dhaka Stock Exchange (DSE) assets in real-time. It solves the problem of scattered financial data by providing a single, unified interface for portfolio management, news aggregation, and market analysis, featuring a robust public view and a personalized authenticated dashboard.

## Table of Contents

- [The Essentials](#the-essentials)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Configuration](#configuration)

---

## The Essentials

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v18.0 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** (Optional, defaults to SQLite for dev)
- **Redis** (Required for background tasks like price updates)

### Installation

Follow these steps to set up the development environment:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/enamulhasan248/LedgerSync-A-Smart-Crypto-Finance-Dashboard.git
    cd asset-tracker-pro-main
    ```

2.  **Backend Setup (Django):**
    ```bash
    cd core
    python -m venv venv
    
    # Activate virtual environment
    # Windows:
    venv\Scripts\activate
    # macOS/Linux:
    # source venv/bin/activate
    
    pip install -r requirements.txt
    
    # Run migrations
    python manage.py migrate
    
    # Start the backend server
    python manage.py runserver
    ```
    *Note: If you don't have a `requirements.txt` yet, install dependencies manually based on `settings.py`: `pip install django djangorestframework django-cors-headers djangorestframework-simplejwt django-allauth dj-rest-auth django-filter python-decouple dj-database_url redis celery yfinance pycoingecko bdshare`*

3.  **Frontend Setup (React/Vite):**
    Open a new terminal and navigate to the root directory (where `package.json` is).
    ```bash
    npm install
    npm run dev
    ```

4.  **Celery Worker (For real-time updates):**
    Open a third terminal in the `core` directory with your venv activated.
    ```bash
    celery -A core worker -l info
    ```

5.  **Celery Beat (For scheduled tasks):**
    Open a fourth terminal in the `core` directory.
    ```bash
    celery -A core beat -l info
    ```

## Usage

Once both servers are running:

- **Frontend:** Visit `http://localhost:8080` (or the port shown in your terminal).
- **Backend API:** Access the API at `http://127.0.0.1:8000/api/`.

### Public Access
- **Home:** Landing page with market overview.
- **Stocks/Crypto:** Browse assets without logging in at `/stocks` and `/crypto`.
- **News:** Read global financial news at `/news`.

### Authenticated Dashboard
1.  Click "Login / Sign Up" to create an account.
2.  Access your personal dashboard to view your portfolio value.
3.  Add assets to your watchlist to track them closely.
4.  View detailed interactive charts for any asset.

## Features

- **Public Market Browser:** distinct, grid-based views for Stocks and Crypto accessible to everyone.
- **Global & Local Markets:** dedicated support for Global Stocks (Yahoo Finance), Cryptocurrencies (CoinGecko), and Dhaka Stock Exchange (DSE).
- **Real-time News:** Aggregated financial news from US, UK, Japan, and Bangladesh.
- **Interactive Charts:** Dynamic price history charts with adjustable timeframes (24h, 7d, etc.).
- **User Dashboard:** Personalized view with portfolio tracking and watchlist management.
- **Secure Authentication:** JWT-based authentication system.
- **Personalized Watchlist:** Users can "star" assets to create a custom monitoring feed.
- **Set Alert:** Users can set an alert for a specific asset that they are targeting to buy or sell once it reaches the targeted price point. The system will alert the user with a notification.

## Tech Stack

**Frontend:**
- **React.js** (Vite)
- **TypeScript**
- **Tailwind CSS** (Styling)
- **Shadcn UI** (Component Library)
- **TanStack Query** (Data Fetching)
- **Recharts** (Charting)

**Backend:**
- **Django** (Python Framework)
- **Django REST Framework** (API)
- **Celery & Redis** (Async Tasks & Scheduling)
- **PostgreSQL / SQLite** (Database)

## Configuration

Create a `.env` file in the `core` directory with the following variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=postgres://user:password@localhost:5432/ledgersync
# Or for SQLite: sqlite:///db.sqlite3
REDIS_URL=redis://localhost:6379/0
```

