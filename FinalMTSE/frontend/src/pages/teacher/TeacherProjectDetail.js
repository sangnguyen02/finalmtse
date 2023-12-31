import React, { useEffect, useState } from 'react'
import { getMajorStudentsByTeacher, getProjectDetailsByTeacher } from '../../../src/redux/majorRelated/majorHandle';
import { getStudentsSameProject } from '../../../src/redux/studentRelated/studentHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../src/components/buttonStyles';
import TableTemplate from '../../../src/components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const ViewProject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, projectDetailsByTeacher, majorStudentsByTeacher, getresponse, error } = useSelector((state) => state.major);
  const { studentsProjectList} = useSelector((state) => state.student);
  const { majorID, projectID } = params

  useEffect(() => {
    dispatch(getProjectDetailsByTeacher(projectID, "Project"));
    dispatch(getMajorStudentsByTeacher(majorID));
    dispatch(getStudentsSameProject(projectID, "StudentsProject"))
  }, [dispatch, projectID, majorID]);
  console.log("Project ID",projectID)
  console.log("Major ID",majorID)
  console.log("Project detail", projectDetailsByTeacher)

  if (error) {
    console.log(error)
  }
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('marks');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };
  console.log("student same project", studentsProjectList)

  const studentColumns = [
    { id: 'studentID', label: 'StudentID', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = studentsProjectList?.map((student) => {
    return {
      studentID: student.studentID,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/project/student/attendance/${row.id}/${projectID}`)
          }
        >
          Take Attendancestudent
        </PurpleButton>
      </>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Teacher/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton variant="contained"
          onClick={() => navigate(`/Teacher/project/student/marks/${row.id}/${projectID}`)}>
          Provide Marks
        </PurpleButton>
      </>
    );
  };

  const ProjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/major/addstudents/" + majorID)}
              >
                Add Students
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Students List:
            </Typography>

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>

          </>
        )}
      </>
    )
  }
  console.log(majorStudentsByTeacher)
  console.log("Data project",projectDetailsByTeacher)
  const ProjectDetailsSection = () => {

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Project Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Project Name : {projectDetailsByTeacher && projectDetailsByTeacher.projectName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Project Code : {projectDetailsByTeacher && projectDetailsByTeacher.projectCode}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Project Sessions : {projectDetailsByTeacher && projectDetailsByTeacher.sessions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Project Description : {projectDetailsByTeacher && projectDetailsByTeacher.description}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Major Name : {projectDetailsByTeacher && projectDetailsByTeacher.majorName && projectDetailsByTeacher.majorName.majorName}
        </Typography>
        {projectDetailsByTeacher && projectDetailsByTeacher.teacher ?
          <Typography variant="h6" gutterBottom>
            Teacher Name : {projectDetailsByTeacher.teacher.name}
          </Typography>
          :
          <GreenButton variant="contained"
            onClick={() => navigate("/Admin/teachers/addteacher/" + projectDetailsByTeacher._id)}>
            Add Project Teacher
          </GreenButton>
        }
      </>
    );
  }

  const Submission = () => {
  
    
    return (
      <>
      <a  href={`http://localhost:5000/uploads/${projectDetailsByTeacher.submissions[0].filePath}`} 
          target="_blank" 
          rel="noopener noreferrer">
          File Name: {projectDetailsByTeacher.submissions[0].filePath}
      </a>
      
      <br />
      <Typography variant="h7" align="center" gutterBottom>
          Lasted upload date: {formatDate(projectDetailsByTeacher.submissions[0].submissionDate)}
      </Typography>
      


      </>
    );
  }

  return (
    <>
      {subloading ?
        < div > Loading...</div >
        :
        <>
          <Box sx={{ width: '100%', typography: 'body1', }} >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                  <Tab label="Details" value="1" />
                  <Tab label="Students" value="2" />
                  <Tab label="Submission" value="3" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <ProjectDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <ProjectStudentsSection />
                </TabPanel>
                <TabPanel value="3">
                  <Submission />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      }
    </>
  )
}

export default ViewProject