import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, BookOpen, BarChart3 } from 'lucide-react';

const HomeCards = () => {
    const isAdmin = useSelector((state) => state.auth.isAdmin);
  
    const cards = [
      {
        title: 'Holdings',
        icon: <Search size={40} strokeWidth={1.5} />,
        link: '/browse-holdings',
        disabled: false,
      },
      {
        title: 'Classification Guide',
        icon: <BookOpen size={40} strokeWidth={1.5} />,
        link: '/classification-guide',
        disabled: false,
      },
      {
        title: 'View/Generate Reports',
        icon: <BarChart3 size={40} strokeWidth={1.5} />,
        link: '/reports',
        disabled: !isAdmin,
      },
    ];
  
    return (
      <div className="card-section">
        {cards.map(({ title, icon, link, disabled }) => {
          const CardContent = (
            <div className={`card ${disabled ? 'card-disabled' : ''}`}>
              <div className="card-icon text-center">{icon}</div>
              <div className="card-content text-center">
                <h3>{title}</h3>
                {disabled && <p className="card-disabled-text">Admin only</p>}
              </div>
            </div>
          );
  
          return disabled ? (
            <div key={title}>{CardContent}</div>
          ) : (
            <Link to={link} key={title} className="card-link">
              {CardContent}
            </Link>
          );
        })}
      </div>
    );
  };
  
  export default HomeCards;