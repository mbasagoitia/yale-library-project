import { Link } from 'react-router-dom';
import { Search, BookOpen, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="card-section flex gap-6 justify-center flex-wrap">
      {cards.map(({ title, icon, link }, index) => {
        return (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <Link to={link} className="card-link block">
              <div className="card shadow-lg hover:shadow-xl transition rounded-2xl p-6 bg-white">
                <div className="card-icon text-center mb-3">{icon}</div>
                <div className="card-content text-center">
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HomeCards;
