import "./home.css";
import File from "./components/file.tsx";
import { useState, useEffect } from "react";

type DirectoryEntry = {
  path: string;
  name: string;
  type: "file" | "folder";
  dateModified: string;
  size: number;
  fileType: string;
  fileNo: number;
};

function RecentActivityPanel(props: {
  title: string;
  id: string;
  description: string;
  date: string;
}) {
  console.log(props.id);
  console.log(`http://localhost:3000/api/media/${props.id}/cover`);
  return (
    <>
      <div className="recent-activity-panel">
        <img
          className="recommended-bg"
          src={`http://localhost:3000/api/media/${props.id}/cover`}
          alt=""
          onError={(e) => {
            const img = e.currentTarget;
            img.src = `http://localhost:5173/alpexus/placeholder.png`;
          }}
        />
        <h3>{props.title}</h3>
        <p>{props.date}</p>
        <p>{props.description}</p>
      </div>
    </>
  );
}

type MediaInfo = {
  Id: string;
  Name: string;
  Overview: string | null;
  PremiereDate: string | null;
};

type HomeProp = {
  onRecentFileClicked: (path: string) => void;
};

function Home({ onRecentFileClicked }: HomeProp) {
  const [recentFiles, setRecentFiles] = useState<DirectoryEntry[]>([]);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/files/recent")
      .then((response) => {
        if (response.ok) {
          console.log("Recent Files Fetched");
        } else {
          throw new Error("Failed to fetch recent files");
        }
        return response.json();
      })
      .then((data) => setRecentFiles(data))
      .catch((error) => console.error(error));
  }, []);

  const Activities = [];

  useEffect(() => {
    async function fetchMediaInfo() {
      try {
        const episodeResponse = await (
          await fetch("http://localhost:3000/api/media/episodes")
        ).json();

        const movieResponse = await (await fetch("http://localhost:3000/api/media/movies")).json();

        const musicResponse = await (await fetch("http://localhost:3000/api/media/songs")).json();

        setMediaInfo([...episodeResponse, ...movieResponse, ...musicResponse]);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      }
    }

    fetchMediaInfo();
  }, []);

  for (let i = 0; i < 6 && i < mediaInfo.length; i++) {
    const activity = mediaInfo[Math.floor(Math.random() * mediaInfo.length)];

    Activities.push(
      <RecentActivityPanel
        key={activity.Name}
        id={activity.Id}
        title={activity.Name}
        description={activity.Overview ?? ""}
        date={
          activity.PremiereDate
            ? new Date(activity.PremiereDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : ""
        }
      />,
    );
  }

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-info">
          <div className="dashboard-top-row">
            <div className="top-row-column">
              <h1>Dashboard</h1>
              <h1 className="greeting">Hello Jonny!</h1>
            </div>
          </div>
          <div className="quick-access">
            <div className="files-quick-access panel">
              <div className="panel-header">
                <i className="fa-solid fa-folder-open fa-xl"></i>
                <h2>Files</h2>
              </div>
              <div className="quick-access-files-list">
                {recentFiles.map((recentFile) => (
                  <File
                    key={recentFile.path}
                    name={recentFile.name}
                    type={recentFile.type}
                    fileType={recentFile.fileType}
                    size={recentFile.size}
                    date={recentFile.dateModified}
                    bg={false}
                    onClick={() => {
                      onRecentFileClicked(
                        recentFile.fileType == ""
                          ? recentFile.path.replace(recentFile.name, "")
                          : recentFile.path.replace(
                              recentFile.name + "." + recentFile.fileType,
                              "",
                            ),
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="recent-activity panel">
            <h2 className="panel-header">Recommended</h2>
            <div className="recent-activity-list">{Activities}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
