import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Plus } from "lucide-react";

// Components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Layouts
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const ClientAddPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    address: "",
    secteur: "",
    description: "",
    mail: "",
    phone: "",
    logo: null,
  });

  const [subClients, setSubClients] = useState([]);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({
    nom: "",
    address: "",
    description: "",
    secteur: "",
    mail: "",
    phone: "",
    subClientErrors: [],
  });

  const navigate = useNavigate();

  const handleAddSubClient = () => {
    setSubClients([
      ...subClients,
      { nom: "", email: "", address: "", description: "" },
    ]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubClientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubClients = [...subClients];
    updatedSubClients[index][name] = value;
    setSubClients(updatedSubClients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    let subClientErrors = [];
    let isValid = true;

    if (!formData.nom) {
      formErrors.nom = "Nom est requis.";
      isValid = false;
    }
    if (!formData.description) {
      formErrors.description = "Description est requise.";
      isValid = false;
    }
    if (!formData.address) {
      formErrors.address = "Adresse est requise.";
      isValid = false;
    }
    if (!formData.secteur) {
      formErrors.secteur = "Secteur est requis.";
      isValid = false;
    }
    if (!formData.mail) {
      formErrors.mail = "Email est requis.";
      isValid = false;
    }
    if (!formData.phone) {
      formErrors.phone = "Numéro de téléphone est requis.";
      isValid = false;
    }

    subClients.forEach((subClient, index) => {
      let subClientError = {};
      if (!subClient.nom) subClientError.nom = "Nom du site est requis.";
      if (!subClient.email) subClientError.email = "Email du site est requis.";
      if (!subClient.address) subClientError.address = "Adresse du site est requise.";
      if (Object.keys(subClientError).length > 0) {
        subClientErrors[index] = subClientError;
        isValid = false;
      }
    });

    setErrors({
      ...formErrors,
      subClientErrors: subClientErrors,
    });

    if (!isValid) return;

    const form = new FormData();
    form.append("nom", formData.nom);
    form.append("address", formData.address);
    form.append("secteur", formData.secteur);
    form.append("description", formData.description);
    form.append("mail", formData.mail);
    form.append("phone", formData.phone);
    if (formData.logo) {
      form.append("logo", formData.logo);
    }

    subClients.forEach((subClient, index) => {
      form.append(`subClientNom[${index}]`, subClient.nom);
      form.append(`subClientEmail[${index}]`, subClient.email);
      form.append(`subClientAddress[${index}]`, subClient.address);
      form.append(`subClientDescription[${index}]`, subClient.description);
    });
  

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token manquant");
        return;
      }

      const response = await fetch("http://localhost:5000/api/clientajout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Client ajouté :", data);
        navigate("/Clients");
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
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h5" color="white">
                  Ajouter un client
                </MDTypography>
              </MDBox>

              <MDBox p={4}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={Boolean(errors.nom)}
                        helperText={errors.nom}
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
                        error={Boolean(errors.address)}
                        helperText={errors.address}
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
                        error={Boolean(errors.secteur)}
                        helperText={errors.secteur}
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
                        error={Boolean(errors.description)}
                        helperText={errors.description}
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
                        error={Boolean(errors.mail)}
                        helperText={errors.mail}
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
                        error={Boolean(errors.phone)}
                        helperText={errors.phone}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <label htmlFor="upload-logo">
                        <input
                          accept="image/*"
                          id="upload-logo"
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                        <MDButton
                          variant="contained"
                          color="primary"
                          component="span"
                          sx={{ mt: 1, color: "white" }}
                        >
                          Ajouter un Logo
                        </MDButton>
                      </label>

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
                      {subClients.map((subClient, index) => (
                        <div key={index}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Nom du site"
                                name="nom"
                                value={subClient.nom}
                                onChange={(e) => handleSubClientChange(index, e)}
                                fullWidth
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Contact du site"
                                name="email"
                                value={subClient.email}
                                onChange={(e) => handleSubClientChange(index, e)}
                                fullWidth
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Adresse du site"
                                name="address"
                                value={subClient.address}
                                onChange={(e) => handleSubClientChange(index, e)}
                                fullWidth
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Description du site"
                                name="description"
                                value={subClient.description}
                                onChange={(e) => handleSubClientChange(index, e)}
                                fullWidth
                                margin="normal"
                              />
                            </Grid>
                          </Grid>

                          {index < subClients.length - 1 && (
                            <div
                              style={{
                                height: '2px',
                                backgroundColor: '#ccc',
                                margin: '20px 0',
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <MDButton
                          variant="text"
                          color="primary"
                          sx={{
                            mt: 1,
                            color: "white",
                            padding: "12px 50px",
                          }}
                          onClick={handleAddSubClient}
                        >
                          <Plus /> Ajouter un site
                        </MDButton>
                      </Grid>
                      <Grid item xs={6} container justifyContent="flex-end">
                        <MDButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{
                            mt: 1,
                            color: "white",
                            padding: "12px 50px",
                          }}
                        >
                          Valider
                        </MDButton>
                      </Grid>
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
