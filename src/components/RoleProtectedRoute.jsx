// import { Navigate } from "react-router-dom";

// const RoleProtectedRoute = ({ children, allowedRoles }) => {
//   const token = localStorage.getItem("email");
//   const role = localStorage.getItem("roles"); // save this at login

//   if (!token) return <Navigate to="/login" replace />;

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// export default RoleProtectedRoute;



import { Navigate, useLocation } from "react-router-dom";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("email");
  const rolesJson = localStorage.getItem("roles");
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (!rolesJson) return <Navigate to="/dashboard" replace />;
  
  const roles = JSON.parse(rolesJson);  // Parse array: ["HR"]
  
  // Check if any user role matches allowed roles
  if (!roles.some(userRole => allowedRoles.includes(userRole))) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RoleProtectedRoute;
