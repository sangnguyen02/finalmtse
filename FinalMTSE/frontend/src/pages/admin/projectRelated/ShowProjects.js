import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getProjectList } from '../../../redux/majorRelated/majorHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowProjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { projectsList, loading, error, response } = useSelector((state) => state.major);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getProjectList(currentUser._id, "AllProjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getProjectList(currentUser._id, "AllProjects"));
        //     })
    }

    const projectColumns = [
        { id: 'projectName', label: 'Project Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'majorName', label: 'Major', minWidth: 170 },
    ]

    // const projectRows = projectList.map((project) => {
    //     return {
    //         projectName: project.projectName,
    //         sessions: project.sessions,
    //         majorName: project.majorName.majorName,
    //         majorID: project.majorName._id,
    //         id: project._id,
    //     };
    // })
    const projectRows = projectsList ? (
        projectsList.map((project) => ({
          projectName: project.projectName,
          sessions: project.sessions,
          majorName: project.majorName.majorName,
          majorID: project.majorName._id,
          id: project._id,
        }))
      ) : [];

    const ProjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Project")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate(`/Admin/projects/project/${row.majorID}/${row.id}`)}>
                    View
                </BlueButton>
            </>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Project',
            action: () => navigate("/Admin/projects/choosemajor")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Projects',
            action: () => deleteHandler(currentUser._id, "Projects")
        }
    ];

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained"
                                onClick={() => navigate("/Admin/projects/choosemajor")}>
                                Add Project
                            </GreenButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(projectsList) && projectsList.length > 0 &&
                                <TableTemplate buttonHaver={ProjectsButtonHaver} columns={projectColumns} rows={projectRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </>
    );
};

export default ShowProjects;