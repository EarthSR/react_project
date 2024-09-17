import React, { useState, useEffect } from 'react';
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
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function CustomerManagement() {
    const [customers, setCustomers] = useState([]); // Initial state as an array
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/customer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
        }
    };

    const handleClickOpenEdit = (customer) => {
        setSelectedCustomer(customer);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => setOpenEdit(false);
    const handleClickOpenDelete = (customer) => {
        setSelectedCustomer(customer);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => setOpenDelete(false);

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setSelectedCustomer({ ...selectedCustomer, [name]: value });
    };

    const handleUpdateCustomer = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}api/customer/${selectedCustomer.custID}`,
                selectedCustomer,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = response.data;
            const { message, status } = result;

            if (status === true || message === 'แก้ไขข้อมูลลูกค้าเรียบร้อยแล้ว') {
                fetchCustomers();
                handleCloseEdit();
            } else {
                setError(message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const { message, status } = error.response.data;
                if (status === false) {
                    setError(message);
                }
            } else {
                console.error('Error updating customer:', error);
                setError('An error occurred while updating the customer. Please try again.');
            }
        }
    };

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
            } else {
                setError(message);
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
        }
    };

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Customer Management</Typography>
                </Toolbar>
            </AppBar>

            <Box mt={4}>
                {error && <Typography color="error">{error}</Typography>}

                {/* Customer List */}
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.custID}>
                                    <TableCell>{customer.username}</TableCell>
                                    <TableCell>{customer.firstName}</TableCell>
                                    <TableCell>{customer.lastName}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.gender}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleClickOpenEdit(customer)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpenDelete(customer)}>
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
                        <TextField
                            margin="dense"
                            name="username"
                            label="Username"
                            fullWidth
                            value={selectedCustomer?.username || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="firstName"
                            label="First Name"
                            fullWidth
                            value={selectedCustomer?.firstName || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="lastName"
                            label="Last Name"
                            fullWidth
                            value={selectedCustomer?.lastName || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            fullWidth
                            value={selectedCustomer?.email || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="gender"
                            label="Gender"
                            fullWidth
                            select
                            value={selectedCustomer?.gender || ''}
                            onChange={handleEditChange}
                        >
                            <MenuItem value="ชาย">ชาย</MenuItem>
                            <MenuItem value="หญิง">หญิง</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEdit}>Cancel</Button>
                        <Button onClick={handleUpdateCustomer}>Update</Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Delete Customer</DialogTitle>
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
