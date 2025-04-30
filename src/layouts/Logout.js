import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Composant de déconnexion
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer le token du localStorage
    localStorage.removeItem("token");

    // Rediriger vers la page de connexion
    navigate("/authentication/sign-in");
  }, [navigate]);

  return null; // Ce composant ne rend rien, il effectue juste l'action
};

export default Logout;
