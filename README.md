# Alpexus

Alpexus is a web server, that acts as a replacement for Google Drive/OneDrive, Netflix, and Spotify for submission to the Cloudfall program ran by Hackclub, made using React and Node.js

## Installation

### Prerequisites

- Docker Desktop (Windows/MacOs)
- Docker Engine and Docker Compose (Linux)
- Jellyfin

### Step 1: Clone the repo
```
https://github.com/jona-mtw/alpexus.git
cd alpexus
```

### Step 2: Configure Alpexus
Open a terminal in the Alpexus repository's root directory and run:
- If on macOs, Linux or in GitBash:  ```cp backend/.env.example backend/.env``` 
- Or if in Powershell:
 `Copy-Item backend//.env.example backend/.env`

Then launch Jellyfin, and open the dashboard in your browser and sign into Jellyfin. If you do not know how to open the dashboard, it will most likely be ```http://localhost:8096```. If its on another device on your local network, type your server's local IPv4 address followed by `:8096`. Then copy the url.

Open the `.env` file and paste the url where it says `JELLYFIN_URL`. Then go back to the dashboard, and find where it says API Keys in the sidebar. Click new api key, and copy it. Then paste it where it says `JELLYFIN_API_KEY` in the `.env` file.

Ensure your api key is not get shared with anyone. 

### Step 3: Start Alpexus
Enter `docker compose up -d` in GitBash, making sure the repository's root directory is open.

### Step 4: Open Alpexus
Open `http://localhost:3000` in your browser. In settings, you can set your name and your total storage capacity.

### Step 5: Stopping Alpexus
Enter `docker compose down`, making sure the repository's root directory is open.