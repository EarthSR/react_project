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

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false); // State for Add Employee dialog
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({ username: '', password: '', firstName: '', lastName: '', email: '', gender: '' }); // State for new employee
    const [error, setError] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false); // State for error dialog

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/employee`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (Array.isArray(response.data)) {
                setEmployees(response.data);
                setError('');
            } else {
                setEmployees([]);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployees([]);
            setError('An error occurred while fetching employees.');
            setOpenErrorDialog(true); // Open the error dialog
        }
    };

    const handleClickOpenEdit = (employee) => {
        setSelectedEmployee(employee);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => setOpenEdit(false);
    const handleClickOpenDelete = (employee) => {
        setSelectedEmployee(employee);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => setOpenDelete(false);
    const handleClickOpenAdd = () => setOpenAdd(true); // Open Add Employee dialog
    const handleCloseAdd = () => setOpenAdd(false);

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setSelectedEmployee({ ...selectedEmployee, [name]: value });
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleAddEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}api/employee`,
                newEmployee,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = response.data;
            const { message, status } = result;

            if (status === true || message === 'เพิ่มข้อมูลพนักงานเรียบร้อยแล้ว') {
                fetchEmployees();
                handleCloseAdd();
                setNewEmployee({ username: '', password: '', firstName: '', lastName: '', email: '', gender: '' });
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
                console.error('Error adding employee:', error);
                setError('An error occurred while adding the employee. Please try again.');
            }
            setOpenErrorDialog(true); // Open the error dialog
        }
    };

    const handleUpdateEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}api/employee/${selectedEmployee.empID}`,
                selectedEmployee,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = response.data;
            const { message, status } = result;

            if (status === true || message === 'แก้ไขข้อมูลพนักงานเรียบร้อยแล้ว') {
                fetchEmployees();
                handleCloseEdit();
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
                console.error('Error updating employee:', error);
                setError('An error occurred while updating the employee. Please try again.');
            }
            setOpenErrorDialog(true); // Open the error dialog
        }
    };

    const handleDeleteEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}api/employee/${selectedEmployee.empID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = response.data;
            const { message, status } = result;

            if (status === true || message === 'ลบข้อมูลพนักงานเรียบร้อยแล้ว') {
                fetchEmployees();
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
                console.error('Error deleting employee:', error);
                setError('An error occurred while deleting the employee. Please try again.');
            }
            setOpenErrorDialog(true); // Open the error dialog
        }
    };

    // Error Dialog Handlers
    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
        setError('');
    };

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Employee Management</Typography>
                </Toolbar>
            </AppBar>

            <Box mt={4}>
                <Button variant="contained" color="primary" onClick={handleClickOpenAdd} style={{ marginBottom: 20 }}>
                    Add Employee
                </Button>

                {/* Employee List */}
                <TableContainer component={Paper}>
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
                            {employees.map((employee) => (
                                <TableRow key={employee.empID}>
                                    <TableCell>{employee.username}</TableCell>
                                    <TableCell>{employee.firstName}</TableCell>
                                    <TableCell>{employee.lastName}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.gender}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleClickOpenEdit(employee)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpenDelete(employee)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Error Dialog */}
                <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <Typography color="error">{error}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseErrorDialog}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Add Employee Dialog */}
                <Dialog open={openAdd} onClose={handleCloseAdd}>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="username"
                            label="Username"
                            fullWidth
                            value={newEmployee.username}
                            onChange={handleAddChange}
                        />
                        <TextField
                            margin="dense"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            value={newEmployee.password}
                            onChange={handleAddChange}
                        />
                        <TextField
                            margin="dense"
                            name="firstName"
                            label="First Name"
                            fullWidth
                            value={newEmployee.firstName}
                            onChange={handleAddChange}
                        />
                        <TextField
                            margin="dense"
                            name="lastName"
                            label="Last Name"
                            fullWidth
                            value={newEmployee.lastName}
                            onChange={handleAddChange}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            fullWidth
                            value={newEmployee.email}
                            onChange={handleAddChange}
                        />
                        <TextField
                            margin="dense"
                            name="gender"
                            label="Gender"
                            fullWidth
                            select
                            value={newEmployee.gender}
                            onChange={handleAddChange}
                        >
                            <MenuItem value="ชาย">ชาย</MenuItem>
                            <MenuItem value="หญิง">หญิง</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAdd}>Cancel</Button>
                        <Button onClick={handleAddEmployee}>Add</Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Employee Dialog */}
                <Dialog open={openEdit} onClose={handleCloseEdit}>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="username"
                            label="Username"
                            fullWidth
                            value={selectedEmployee?.username || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="firstName"
                            label="First Name"
                            fullWidth
                            value={selectedEmployee?.firstName || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="lastName"
                            label="Last Name"
                            fullWidth
                            value={selectedEmployee?.lastName || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            fullWidth
                            value={selectedEmployee?.email || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="gender"
                            label="Gender"
                            fullWidth
                            select
                            value={selectedEmployee?.gender || ''}
                            onChange={handleEditChange}
                        >
                            <MenuItem value="ชาย">ชาย</MenuItem>
                            <MenuItem value="หญิง">หญิง</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEdit}>Cancel</Button>
                        <Button onClick={handleUpdateEmployee}>Update</Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Delete Employee</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this employee?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                        <Button onClick={handleDeleteEmployee}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}

export default EmployeeManagement;
