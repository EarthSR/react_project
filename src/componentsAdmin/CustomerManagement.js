import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  Paper,
  MenuItem,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

function CustomerManagement() {
  const [Customers, setCustomers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/Customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        setCustomers(response.data);
        setError("");
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching Customers:", error);
      setCustomers([]);
      setError("An error occurred while fetching Customers.");
      setOpenErrorDialog(true);
    }
  };

  const fetchCustomerProfile = async (custID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/profile/${custID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(response.data);
      setOpenProfile(true);
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      setError("An error occurred while fetching profile.");
      setOpenErrorDialog(true);
    }
  };

  const handleClickOpenEdit = (Customer) => {
    setSelectedCustomer(Customer);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleClickOpenDelete = (Customer) => {
    setSelectedCustomer(Customer);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleClickOpenProfile = (Customer) => {
    fetchCustomerProfile(Customer.custID);
  };
  const handleCloseProfile = () => setOpenProfile(false);

  const handleDeleteCustomer = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}api/customer/${selectedCustomer.custID}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const result = response.data;
        const { message, status } = result;

        if (status === true || message === 'ลบข้อมูลลูกค้าเรียบร้อยแล้ว') {
            fetchCustomers();
            handleCloseDelete();
            setError('');
        } else {
            setError(message);
            setOpenErrorDialog(true); // Open the error dialog
        }
    } catch (error) {
        if (error.response && error.response.data) {
            const { message, status } = error.response.data;
            if (status === false) {
                setError(message);
            }
        } else {
            console.error('Error deleting customer:', error);
            setError('An error occurred while deleting the customer. Please try again.');
        }
        setOpenErrorDialog(true); // Open the error dialog
    }
};


  const handleUpdateCustomer = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", selectedCustomer.username || "");
      formData.append("firstName", selectedCustomer.firstName || "");
      formData.append("lastName", selectedCustomer.lastName || "");
      formData.append("email", selectedCustomer.email || "");
      formData.append("gender", selectedCustomer.gender);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}api/customer/${selectedCustomer.custID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      if (result.status === true) {
        fetchCustomers();
        handleCloseEdit();
        setError("");
      } else {
        setError(result.message);
        setOpenErrorDialog(true);
      }
    } catch (error) {
      console.error("Error updating Customer:", error);
      setError("An error occurred while updating the Customer.");
      setOpenErrorDialog(true);
    }
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
    setError("");
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Customer Management</Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Picture</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Customers.map((Customer) => (
                <TableRow key={Customer.custID}>
                  <TableCell>{Customer.custID}</TableCell>
                  <TableCell>
                    <img
                      src={`${process.env.REACT_APP_API_URL}api/customer/image/${Customer.imageFile}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </TableCell>
                  <TableCell>{Customer.firstName}</TableCell>
                  <TableCell>{Customer.lastName}</TableCell>
                  <TableCell>{Customer.email}</TableCell>
                  <TableCell>
                    {Customer.gender === 0 ? "ชาย" : "หญิง"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleClickOpenProfile(Customer)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleClickOpenEdit(Customer)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleClickOpenDelete(Customer)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Customer Dialog */}
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogContent>
            {/* ตรวจสอบก่อนว่ามี selectedCustomer หรือไม่ */}
            {selectedCustomer ? (
              <>
                {/* แสดงรูปภาพปัจจุบันของลูกค้า */}
                <Box mb={2} textAlign="center">
                  <img
                    src={`${process.env.REACT_APP_API_URL}api/customer/image/${selectedCustomer.imageFile}`}
                    alt="Customer"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      marginBottom: "10px",
                    }}
                  />
                </Box>

                <Box
                  mt={2}
                  display="flex" // ตั้งค่า display เป็น flex
                  justifyContent="center" // จัดตำแหน่งให้อยู่กึ่งกลางแนวนอน
                  alignItems="center" // จัดตำแหน่งให้อยู่กึ่งกลางแนวตั้ง
                  flexDirection="column" // จัดเรียงเนื้อหาในแนวตั้ง
                >
                  <Typography>Upload New Picture:</Typography>
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                    style={{ marginTop: "10px" }}
                  />
                </Box>

                {/* ฟิลด์สำหรับแก้ไขข้อมูลลูกค้า */}
                <TextField
                  margin="dense"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  value={selectedCustomer?.firstName || ""}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      firstName: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  value={selectedCustomer?.lastName || ""}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      lastName: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  fullWidth
                  value={selectedCustomer?.email || ""}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      email: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  name="gender"
                  label="Gender"
                  fullWidth
                  select
                  value={selectedCustomer?.gender ?? ""}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      gender: e.target.value,
                    })
                  }
                >
                  <MenuItem value={0}>ชาย</MenuItem>
                  <MenuItem value={1}>หญิง</MenuItem>
                </TextField>
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleUpdateCustomer}>Update</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openProfile} onClose={handleCloseProfile}>
          <DialogTitle>Customer Profile</DialogTitle>
          <DialogContent>
            {profileData ? (
              <Box>
                <Typography>
                  Picture:{" "}
                  <img
                    src={`${process.env.REACT_APP_API_URL}api/customer/image/${profileData.imageFile}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    alt="Customer"
                  />
                </Typography>
                <Typography>ID: {profileData.custID}</Typography>
                <Typography>First Name: {profileData.firstName}</Typography>
                <Typography>Last Name: {profileData.lastName}</Typography>
                <Typography>Email: {profileData.email}</Typography>
                <Typography>
                  Gender: {profileData.gender === 0 ? "ชาย" : "หญิง"}
                </Typography>
                <Typography>
                  Status: {profileData.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProfile}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Typography color="error">{error}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Delete Employee</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this customer?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                        <Button onClick={handleDeleteCustomer}>Delete</Button>
                    </DialogActions>
                </Dialog>

      </Box>
    </Container>
  );
}

export default CustomerManagement;
