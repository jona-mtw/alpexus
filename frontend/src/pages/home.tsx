import "./home.css";

function RecentActivityPanel(props: { title: string; description: string; date: string; image: string }) {
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

function Home() {
  const Activities = [];
  for (let i: number = 1; i < 6; i++) {
    Activities.push(<RecentActivityPanel title={`Recent Activity ` + i} description="Hello im a descirptino" date="10-10-2026" image="hello" />);
  }
  return (
    <>
      <h1 className="title">Hello Jonny!</h1>
      <h1>Dashboard</h1>
      <div className="recent-activity">
        <h2>Recent Acitivity</h2>
        <div className="recent-activity-list">{Activities}</div>
      </div>
      <div className="storage-container"></div>
    </>
  );
}

export default Home;
