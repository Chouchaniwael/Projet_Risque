import PropTypes from "prop-types"; // Ajoute cette ligne pour la validation des props
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Images
import backgroundImage from "assets/images/bg-profile.jpeg";  // Ajoute cette ligne pour une image de fond

function ClientHeader({ logo, name }) {
  // Si le logo n'existe pas ou est vide, utiliser un logo par défaut
  const logoSrc = logo && logo.trim() !== "" ? logo : "/assets/images/default-logo.png";

  console.log("Logo path:", logoSrc); // Vérification du chemin du logo

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${backgroundImage})`, // Utilisation de l'image de fond correctement
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >

        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={logoSrc} alt={name} size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {name}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                Client
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </MDBox>
  );
}

ClientHeader.propTypes = {
  logo: PropTypes.string, // Le logo est optionnel, donc on n'utilise pas `isRequired` ici
  name: PropTypes.string.isRequired,  // Le nom est requis
};

ClientHeader.defaultProps = {
  logo: "",  // Valeur par défaut si aucun logo n'est fourni
};

export default ClientHeader;
