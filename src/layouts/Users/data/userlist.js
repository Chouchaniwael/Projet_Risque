/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import defaultImage from "assets/images/team-3.jpg";

export default function useUserData() {
  const Author = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={defaultImage} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const [userData, setUserData] = useState({
    columns: [
      { Header: "Utilisateur", accessor: "author", width: "25%", align: "left" },
      { Header: "Rôle", accessor: "function", align: "left" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Date de création", accessor: "createdAt", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();

        const rows = data.map((user) => ({
          author: <Author name={`${user.prenom} ${user.nom}`} email={user.email} />,
          function: <Job title={user.role} description={user.identifiant} />,
          email: (
            <MDTypography variant="caption" fontWeight="regular">
              {user.email}
            </MDTypography>
          ),
          createdAt: (
            <MDTypography variant="caption" fontWeight="regular">
              {new Date(user.date_creation).toLocaleDateString()}
            </MDTypography>
          ),
        }));

        setUserData((prev) => ({ ...prev, rows }));
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, []);

  return userData;
}
