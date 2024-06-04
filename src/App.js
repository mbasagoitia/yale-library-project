import logo from './logo.svg';
import './App.css';
import GenreDropdown from './classifications/components/GenreDropdown';
import topLevel from './classifications/topLevel';

function App() {
  return (
    <div className="App">
      <GenreDropdown items={topLevel} />
    </div>
  );
}

export default App;
