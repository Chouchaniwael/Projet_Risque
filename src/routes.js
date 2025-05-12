import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import CentreValidation from "layouts/authentication/CentreValidation";
import ForgotPassword from "nejdWork/forgot_password";
import ResetPassword from "nejdWork/reset_password";
import Logout from "layouts/Logout";
import Users from "layouts/Users";
// @mui icons
import Icon from "@mui/material/Icon";

// Fonction pour récupérer le rôle de l'utilisateur depuis le localStorage
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.role; // Récupère le rôle de l'utilisateur
  }
  return null;
};

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    show: getUserRole() !== "admin",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Clients",
    key: "Clients",
    show: getUserRole() !== "admin",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/Clients",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Scénario de risque",
    key: "Risque",
    show: getUserRole() !== "admin",
    icon: <Icon fontSize="small">report_problem</Icon>,
    route: "/Risque",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    show: getUserRole() !== "admin",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    show: getUserRole() !== "admin",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    key: "sign-in",
    show: false,
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    key: "Validation",
    name: "Centre de validation",
    show: getUserRole() === "Manager" || getUserRole() === "Directeur",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/Validation",
    component: <CentreValidation />,
  },
  {
    type: "collapse",
    key: "forgot-password",
    show: false,
    icon: <Icon fontSize="small">forgot password</Icon>,
    route: "/authentication/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "collapse",
    key: "reset-password",
    show: false,
    icon: <Icon fontSize="small">reset password</Icon>,
    route: "/authentication/reset-password/:token",
    component: <ResetPassword />,
  },
 
   {
    type: "collapse",
    name: "Utilisateurs",
    key: "users",
    show: getUserRole() === "admin" || getUserRole() === "Directeur",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: <Users />,
  },
   {
    type: "collapse",
    name: "Déconnexion",
    key: "rtl",
    show: "true",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/Déconnexion",
    component: <Logout />,
  },
];

export default routes;
