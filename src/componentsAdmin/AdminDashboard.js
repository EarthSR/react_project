import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
  CssBaseline,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group"; // Icon for Employees
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const drawerWidth = 240;

// Sample data for the graph
const data = [
  { name: "Jan", users: 30 },
  { name: "Feb", users: 45 },
  { name: "Mar", users: 70 },
  { name: "Apr", users: 90 },
  { name: "May", users: 100 },
  { name: "Jun", users: 85 },
];

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: "#2E3B55",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#2E3B55",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {/* Menu Items */}
            <ListItem button>
              <ListItemIcon sx={{ color: "#fff" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              onClick={() => (window.location.href = "/CustomerManagement")}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem
              button
              onClick={() => (window.location.href = "/Management")}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Employees" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.clear();
                window.location.href = "/LoginAdmin";
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          p: 3,
          background: "#f5f5f5",
        }}
      >
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          User Growth Over Time
        </Typography>

        {/* สถิติการเติบโตของผู้ใช้งาน */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#E3F2FD" }}>
              <CardContent>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4" color="primary">
                  450
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#E8F5E9" }}>
              <CardContent>
                <Typography variant="h6">New Users</Typography>
                <Typography variant="h4" color="green">
                  +50
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#FFEBEE" }}>
              <CardContent>
                <Typography variant="h6">Active Users</Typography>
                <Typography variant="h4" color="error">
                  300
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Graph Section */}
        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            User Growth Over the Months
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Footer with a Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert("More Analytics Coming Soon!")}
          >
            View More Analytics
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
