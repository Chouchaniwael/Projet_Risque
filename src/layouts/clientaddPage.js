import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Box } from "@mui/material";

// Material Dashboard 2 React
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layouts
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const ClientAddPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    secteur: "",
    description: "",
    mail: "",
    phone: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("address", formData.address);
    form.append("secteur", formData.secteur);
    form.append("description", formData.description);
    form.append("mail", formData.mail);
    form.append("phone", formData.phone);
    if (formData.logo) {
      form.append("logo", formData.logo);
    }

    try {
      const response = await fetch("http://localhost:5000/api/clientajout", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Client ajouté :", data);
        navigate("/tables");
      } else {
        console.error("❌ Erreur lors de l'ajout du client");
      }
    } catch (error) {
      console.error("❌ Erreur serveur :", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={6}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* En-tête bleu avec le titre */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Ajouter un client
                </MDTypography>
              </MDBox>

              {/* Formulaire dans un cadre blanc */}
              <MDBox p={4}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Nom"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Adresse"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Secteur"
                        name="secteur"
                        value={formData.secteur}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Mail"
                        name="mail"
                        value={formData.mail}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Téléphone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align="left" mt={2} mb={1}>
                        Logo de l’entreprise :
                      </Typography>
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
                      {preview && (
                        <MDBox mt={2}>
                          <img
                            src={preview}
                            alt="Aperçu du logo"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        </MDBox>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1, color: "WHITE" }}
                        >
                          Ajouter le client
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default ClientAddPage;
