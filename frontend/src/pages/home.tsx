import "./home.css";
import StorageContainer from "./components/storage-panel.tsx";
import SearchBar from "./components/search-bar.tsx";
import File from "./components/file.tsx";

function RecentActivityPanel(props: {
  title: string;
  description: string;
  date: string;
  image: string;
}) {
  return (
    <>
      <div className="recent-activity-panel">
        <h3>{props.title}</h3>
        <p>{props.date}</p>
        <p>{props.description}</p>
      </div>
    </>
  );
}

function Note(props: { name: string; description: string; date: string }) {
  return (
    <>
      <div className="individual-file with-bg">
        <div className="individual-file-left-wrapper">
          <p className="file-name">{props.name}</p>
          <div className="individual-file-left-wrapper-bottom">
            <p className="file-type">{props.description}</p>
          </div>
        </div>
        <p className="file-date">{props.date}</p>
      </div>
    </>
  );
}

function Home() {
  const QuickFiles = [];
  for (let i: number = 0; i < 5; i++) {
    QuickFiles.push(
      <File key={i} name="hello" fileType="tsx" size={5} date="14-10-2026" bg={false} />,
    );
  }

  const QuickNotes = [];
  for (let i: number = 0; i < 5; i++) {
    QuickNotes.push(<Note key={i} name="hello" description="hellooooooo..." date="14-10-2026" />);
  }

  const Activities = [];
  for (let i: number = 1; i < 6; i++) {
    Activities.push(
      <RecentActivityPanel
        key={i}
        title={`Recent Activity ` + i}
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        date="10-10-2026"
        image="hello"
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
            <div className="search-bar-wrapper">
              <SearchBar />
            </div>
          </div>
          <div className="quick-access">
            <div className="files-quick-access panel">
              <div className="panel-header">
                <i className="fa-solid fa-folder-open fa-xl"></i>
                <h2>Files</h2>
              </div>
              <div className="quick-access-files-list">{QuickFiles}</div>
            </div>
            <div className="notes-quick-access panel">
              <div className="panel-header">
                <i className="fa-solid fa-note-sticky fa-xl"></i>
                <h2>Notes</h2>
              </div>
              <div className="quick-access-notes-list">{QuickNotes}</div>
            </div>
          </div>
          <div className="recent-activity panel">
            <h2 className="panel-header">Recent Acitivity</h2>
            <div className="recent-activity-list">{Activities}</div>
          </div>
        </div>
      </div>
      <aside className="dashboard-sidebar">
        <StorageContainer />
      </aside>
    </>
  );
}

export default Home;
