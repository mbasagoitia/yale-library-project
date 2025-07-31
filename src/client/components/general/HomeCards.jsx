import { Link } from 'react-router-dom';
import { Search, BookOpen, Monitor } from 'lucide-react';

const HomeCards = () => {

    const cards = [
      {
        title: 'Holdings',
        icon: <Search size={40} strokeWidth={1.5} />,
        link: '/browse-holdings',
      },
      {
        title: 'Classification Guide',
        icon: <BookOpen size={40} strokeWidth={1.5} />,
        link: '/classification-guide',
      },
      {
        title: 'Digital Catalogue',
        icon: <Monitor size={40} strokeWidth={1.5} />,
        link: '/digital-catalogue',
      },
    ];
  
    return (
      <div className="card-section">
        {cards.map(({ title, icon, link }) => {
          const CardContent = (
            <div className="card">
              <div className="card-icon text-center">{icon}</div>
              <div className="card-content text-center">
                <h3>{title}</h3>
              </div>
            </div>
          );
  
          return <Link to={link} key={title} className="card-link">{CardContent}</Link>
        })}
      </div>
    );
  };
  
  export default HomeCards;