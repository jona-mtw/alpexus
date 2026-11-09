# Alpexus

<img width="2246" height="1542" alt="image" src="https://github.com/user-attachments/assets/879e7ebb-60ba-490d-979b-82eb4204e4ef" />

Alpexus is a web server, designed as an alternative to services such as Google Drive, OneDrive, Netflix, and Spotify for submission to the Cloudfall program ran by Hackclub, made using React and Node.js (best viewed on a wide screen).

## Features
- video and audio streaming
- file manager
- storage usage visualised
- personal username
- can change the storage capacity in settings

## Installation

### Prerequisites

- Docker Desktop (Windows/MacOs)
- Docker Engine and Docker Compose (Linux)
- Jellyfin

### Step 1: Clone the repo
Run: `git clone https://github.com/jona-mtw/alpexus.git` in GitBash
Then run `cd alpexus` so that you're in the root directory.


### Step 2: Configure Alpexus
Open a terminal in the Alpexus repository's root directory and run:
- If on macOs, Linux or in GitBash:  ```cp backend/.env.example backend/.env``` 
- Or if in Powershell: `Copy-Item backend/.env.example backend/.env`
Then launch Jellyfin, and open the dashboard in your browser and sign into Jellyfin. 
- If you do not know how to open the dashboard, it will most likely be ```http://localhost:8096```. Then open the `.env` file and paste in `http://host.docker.internal:8096` where it says `JELLYFIN_URL`
- If its on another device on your local network, type your server's local IPv4 address followed by `:8096`, and copy the url. Open the `.env` file and paste the  where it says `JELLYFIN_URL`. 

Then go back to the dashboard, and find where it says API Keys in the sidebar. Click new api key, and copy it. Then paste it where it says `JELLYFIN_API_KEY` in the `.env` file.

Ensure your api key is not get shared with anyone. 

### Step 3: Start Alpexus
Run `docker compose up -d` in the terminal, making sure the repository's root directory is open.

### Step 4: Open Alpexus
Open `http://localhost:3000` in your browser. In settings, you can set your name and your total storage capacity.

### Step 5: Stopping Alpexus
Run `docker compose down`, making sure the repository's root directory is open.


## Help
### Adding media: 
1) In Alpexus, go to Files, and click New Folder. You can name it whatever you want, but for your sake I suggest you name it something along the lines of Media. Then you can make folders inside that called Movies, TV-Shows, and Music depending if you want/have the files for all of them.
2) Open the Jellyfin dashboard, and find `Libraries>Libraries` in the sidebar. Click Add Media Library, and then click the appropriate Content Type, and then find where your Movies, TV-Shows and Music folders are.
3) When you start adding your files, remember that Jellyfin likes them in a certain order. Separate your media by show/movie/album. And for shows, separate your episodes by seasons. By "separate" I mean create new folders.

For Example:

<img width="342" height="332" alt="image" src="https://github.com/user-attachments/assets/94ab920e-571f-4865-8c23-549690bb963c" />

5) Whenever you add media files to those folders, they will update automatically with Alpexus.
