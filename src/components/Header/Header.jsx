import { Link } from "react-router-dom";
import "./Header.css";
import { useState, useEffect } from "react";

const Header = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const backgroundImages = [
    "/src/assets/login.jpg",
    "/src/assets/bk1.jpg", 
    "/src/assets/bk2.webp",
    "/src/assets/bk3.jpeg",
    "/src/assets/bk4.jpg",
    "/src/assets/bk5.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoaded(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        );
        setIsLoaded(true);
      }, 300);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentImage = backgroundImages[currentImageIndex];

  return (
    <div 
      className={`p-5 mb-4 bg-light rounded-3 mt-1 header-hero ${isLoaded ? 'loaded' : ''}`}
      style={{ backgroundImage: `url("${currentImage}")` }}
    >
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold text-white">
          Order your Medicine On NeoCare
        </h1>

        <p className="col-md-8 fs-4 text-white">
          Smart Healthcare for a Healthier Tomorrow.
        </p>

        <Link to="/explore" className="btn btn-primary btn-lg">
          Explore
        </Link>
      </div>
    </div>
  );
};

export default Header;
