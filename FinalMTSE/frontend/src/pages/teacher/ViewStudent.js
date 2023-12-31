import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../src/redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectList } from '../../../src/redux/majorRelated/majorHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Grid, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../src/redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateProjectAttendancePercentage, groupAttendanceByProject } from '../../../src/components/attendanceCalculator';
import CustomBarChart from '../../../src/components/CustomBarChart'
import CustomPieChart from '../../../src/components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../src/components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../src/components/Popup';

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id
    const Address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(studentID, Address));
    }, [dispatch, studentID])

    useEffect(() => {
        if (userDetails && userDetails.majorName && userDetails.majorName._id !== undefined) {
            dispatch(getProjectList(userDetails.majorName._id, "MajorProjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [studentId, setStudentID] = useState('');
    const [password, setPassword] = useState('');
    const [majorName, setMajorName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Female');
    const [projectMarks, setProjectMarks] = useState('');
    const [projectAttendance, setProjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (projectId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [projectId]: !prevState[projectId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === ""
        ? { name, studentId, email, phone, address, gender }
        : { name, studentId, password }

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setStudentID(userDetails.studentID || '');
            setMajorName(userDetails.majorName || '');
            setStudentSchool(userDetails.school || '');
            setEmail(userDetails.email || '');
            setAddress(userDetails.address || '');
            setPhone(userDetails.phone || '');
            setGender(userDetails.gender || '');
            setProjectMarks(userDetails.examResult || '');
            setProjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, studentID, Address))
            .then(() => {
                dispatch(getUserDetails(studentID, Address));
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(studentID, address))
        //     .then(() => {
        //         navigate(-1)
        //     })
    }

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, Address));
            })
    }

    const removeProjectAttendance = (projectId) => {
        dispatch(updateStudentFields(studentID, { projectId }, "RemoveStudentProjectAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, Address));
            })
    }

    const handleEditClick = () => {
        setEditMode(true);
      };
    
      const handleCancelEdit = () => {
        setEditMode(false);
      };

    const overallAttendancePercentage = calculateOverallAttendancePercentage(projectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const projectData = Object.entries(groupAttendanceByProject(projectAttendance)).map(([projectName, { projectCode, present, sessions }]) => {
        const projectAttendancePercentage = calculateProjectAttendancePercentage(present, sessions);
        return {
            project: projectName,
            attendancePercentage: projectAttendancePercentage,
            totalMajors: sessions,
            attendedMajors: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Attendance:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Project</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Attendance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(groupAttendanceByProject(projectAttendance)).map(([projectName, { present, allData, projectId, sessions }], index) => {
                            const projectAttendancePercentage = calculateProjectAttendancePercentage(present, sessions);
                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{projectName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>{projectAttendancePercentage}%</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="contained"
                                                onClick={() => handleOpen(projectId)}>
                                                {openStates[projectId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                            <IconButton onClick={() => removeProjectAttendance(projectId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <Button variant="contained" sx={styles.attendanceButton}
                                                onClick={() => navigate(`/Admin/project/student/attendance/${studentID}/${projectId}`)}>
                                                Change
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[projectId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Attendance Details
                                                    </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        }
                        )}
                    </Table>
                    <div>
                        Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                    </div>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(studentID, "RemoveStudentAtten")}>Delete All</Button>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                        Add Attendance
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={projectData} dataKey="attendancePercentage" />
                </>
            )
        }
        return (
            <>
                {projectAttendance && Array.isArray(projectAttendance) && projectAttendance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                        Add Attendance
                    </Button>
                }
            </>
        )
    }

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Project Marks:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Project</StyledTableCell>
                                <StyledTableCell>Marks</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {projectMarks.map((result, index) => {
                                if (!result.projectName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.projectName.projectName}</StyledTableCell>
                                        <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={projectMarks} dataKey="marksObtained" />
                </>
            )
        }
        return (
            <>
                {projectMarks && Array.isArray(projectMarks) && projectMarks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                }
            </>
        )
    }

    const StudentDetailsSection = () => {
        return (
            <div>
                Name: {userDetails.name}
                <br />
                Student ID: {userDetails.studentID}
                <br />
                Major: {majorName.majorName}
                <br />
                Email: {userDetails.email}
                <br />
                Address: {userDetails.address}
                <br />
                Phone: {userDetails.phone}
                <br />
                Gender: {userDetails.gender}
                <br />
                School: {studentSchool.schoolName}
                {
                    projectAttendance && Array.isArray(projectAttendance) && projectAttendance.length > 0 && (
                        <CustomPieChart data={chartData} />
                    )
                }
                
                <Box display="flex" flexDirection="row">
                    {editMode ? (
                        <Button variant="contained" sx={styles.styledButton} color="secondary" onClick={handleCancelEdit}>
                        Cancel Edit
                        </Button>
                    ) : (
                        <Button variant="contained" sx={styles.styledButton} color="primary" onClick={handleEditClick}>
                        Edit
                        </Button>
                    )}

                    <Button variant="contained" sx={styles.styledButton} onClick={deleteHandler}>
                        Delete
                    </Button>
                </Box>

                <br/>
                {editMode && (
                    <Grid item xs={12}>
                        <div className="register">
                            <form className="registerForm" onSubmit={submitHandler}>
                                <span className="registerTitle">Edit Details</span>
                                <label>Name</label>
                                <input className="registerInput" type="text" placeholder="Enter user's name..."
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    autoComplete="name" required />

                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="Male"
                                        name="radio-buttons-group"
                                        value={gender}
                                        onChange={(event) => setGender(event.target.value)}
                                    >
                                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    </RadioGroup>
                                </FormControl>

                                <label>Student ID</label>
                                <input className="registerInput" type="number" placeholder="Enter user's Student ID..."
                                    value={studentId}
                                    onChange={(event) => setStudentID(event.target.value)}
                                    required />

                                <label>Student Email</label>
                                <input className="registerInput" type="text" placeholder="Enter user's email..."
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required />

                                <label>Student Phone</label>
                                <input className="registerInput" type="text" placeholder="Enter user's phone..."
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value)}
                                    required />


                                <label>Student Address</label>
                                <input className="registerInput" type="text" placeholder="Enter user's address..."
                                    value={address}
                                    onChange={(event) => setAddress(event.target.value)}
                                    required />

                                <label>Password</label>
                                <input className="registerInput" type="password" placeholder="Enter user's password..."
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="new-password" />

                                <button className="registerButton" type="submit" >Update</button>
                            </form>
                        </div>
                    </Grid>
                  )}
            </div>
        )
    }

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Attendance" value="2" />
                                    <Tab label="Marks" value="3" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <StudentDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <StudentAttendanceSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <StudentMarksSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </>
    )
}

export default ViewStudent

const styles = {
    attendanceButton: {
        marginLeft: "20px",
        backgroundColor: "#270843",
        "&:hover": {
            backgroundColor: "#3f1068",
        }
    },
    styledButton: {
        margin: "20px",
        backgroundColor: "#02250b",
        "&:hover": {
            backgroundColor: "#106312",
        }
    }
}