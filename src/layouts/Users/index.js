import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from "react-router-dom";

// Hook pour les données utilisateurs
import useUserData from "./data/userlist";

function Users() {
  const { columns, rows } = useUserData();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Liste des utilisateurs
                  </MDTypography>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/user/ajouter")}
                  >
                    <Icon fontSize="small" color="inherit">
                      person_add
                    </Icon>
                    <MDTypography variant="button" fontWeight="medium" color="white" ml={1}>
                      Ajouter un user
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Users;
