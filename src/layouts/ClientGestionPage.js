import { useEffect, useState } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { useTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from "@mui/icons-material/Facebook";
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import ProfilesList from "examples/Lists/ProfilesList";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { useParams } from "react-router-dom";
import ClientHeader from "./ClientHeader";  
import SiteListData from "./SiteListData";  
import MDButton from "components/MDButton";
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function ClientGestionPage() {
  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    mail: "",
    numero: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { id } = useParams();
  const theme = useTheme();

  // Modal states
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormErrors({});
    setSubmitStatus(null);
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/clients?name=${id}`);
        const data = Array.isArray(response.data) ? response.data[0] : response.data;

        const clientData = {
          nom: data.Nom || "Nom inconnu",
          logo: data.Logo ? `http://localhost:5000/images/${data.Logo}` : "",
          contact: data.Contact || "Non renseigné",
          secteur: data.Secteur || "",
          adresse: data.Adresse || "Non renseignée",
          statut: data.Statut !== undefined ? data.Statut : true,
          etat: data.etat || 0,
          description: data.Description || "Pas de description disponible.",
          mail: data.Mail || "Non renseigné",
          linkedin: data.linkedin || "#",
        };

        setClient(clientData);
        setFormData({
          nom: clientData.nom,
          adresse: clientData.adresse,
          mail: clientData.mail,
          numero: clientData.contact,
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement du client :", error);
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = "Le nom est requis";
    if (!formData.mail.trim()) {
      errors.mail = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      errors.mail = "Email invalide";
    }
    if (formData.numero && !/^\+?[\d\s-]{9,}$/.test(formData.numero)) {
      errors.numero = "Numéro de téléphone invalide";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/api/clients/${id}`, formData);
      setClient((prev) => ({
        ...prev,
        nom: formData.nom,
        adresse: formData.adresse,
        mail: formData.mail,
        contact: formData.numero,
      }));
      setSubmitStatus({ type: 'success', message: 'Informations mises à jour avec succès!' });
      setTimeout(handleClose, 1500);
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Erreur lors de la mise à jour.' });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress color="primary" />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {client && <ClientHeader logo={client.logo} name={client.nom} />}
      <MDBox mt={5} mb={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} xl={4}>
            {client && (
              <ProfileInfoCard
                title={
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: theme.palette.primary.main,
                    transition: 'all 0.3s ease'
                  }}>
                    Informations du client
                    <Tooltip title="Modifier les informations du client" placement="top">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={handleOpen}
                        sx={{ 
                          ml: 1,
                          '&:hover': { 
                            transform: 'scale(1.5)',
                            transition: 'all 0.3s ease'
                            
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </span>
                }
                description={client.description}
                info={{
                  fullName: client.nom,
                  mobile: client.contact,
                  email: client.mail,
                  location: client.adresse,
                }}
                social={[
                  {
                    link: client.linkedin,
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                ]}
                shadow={true}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              />
            )}
          </Grid>

          <Grid item xs={12} xl={4}>
            <ProfilesList
              title={<span style={{ 
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightBold 
              }}>
                Liste des sites
              </span>}
              profiles={SiteListData}
              shadow={true}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            />
          </Grid>
        </Grid>
      </MDBox>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 450 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            transition: 'all 0.3s ease-in-out',
            maxHeight: '90vh',
            overflowY: 'auto',
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          <MDBox mb={3}>
            <MDTypography 
              id="modal-title" 
              variant="h5" 
              fontWeight="bold" 
              color="primary"
              sx={{ mb: 1 }}
            >
              Modifier les informations du client
            </MDTypography>
            <MDTypography 
              id="modal-description" 
              variant="body2" 
              color="text.secondary"
            >
              Mettez à jour les champs ci-dessous et cliquez sur <strong>Valider</strong>.
            </MDTypography>
          </MDBox>

          <MDBox component="form" noValidate autoComplete="off">
            <TextField
              label="Nom"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              name="nom"
              value={formData.nom}
              onChange={handleFormChange}
              error={!!formErrors.nom}
              helperText={formErrors.nom}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Adresse"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              name="adresse"
              value={formData.adresse}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mail"
              fullWidth
              margin="normal"
              variant="outlined"
              type="email"
              InputLabelProps={{ shrink: true }}
              name="mail"
              value={formData.mail}
              onChange={handleFormChange}
              error={!!formErrors.mail}
              helperText={formErrors.mail}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Numéro"
              fullWidth
              margin="normal"
              variant="outlined"
              type="tel"
              InputLabelProps={{ shrink: true }}
              name="numero"
              value={formData.numero}
              onChange={handleFormChange}
              error={!!formErrors.numero}
              helperText={formErrors.numero}
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Annuler
              </MDButton>
              <MDButton
                variant="gradient"
                color="success"
                onClick={handleSubmit}
                sx={{
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Valider
              </MDButton>
            </Box>
          </MDBox>
        </Box>
      </Modal>

      <Snackbar
        open={!!submitStatus}
        autoHideDuration={6000}
        onClose={() => setSubmitStatus(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSubmitStatus(null)}
          severity={submitStatus?.type}
          sx={{ width: '100%' }}
        >
          {submitStatus?.message}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default ClientGestionPage;