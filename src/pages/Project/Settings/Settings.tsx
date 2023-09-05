import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../../components/Shared/Page/PageTitle/PageTitle';
import Page from '../../../components/Shared/Page/Page';
import { Box, Tab, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CustomSwitch from '../../../components/Shared/CustomSwitch/CustomSwitch';
import { editProject, getProjectById } from '../../../api/services/projectsService';
import { Project } from '../../../api/models/project';
import PrimaryButton from '../../../components/Shared/Buttons/PrimaryButton';

const Settings = () => {
	const { projectId } = useParams();
	const [value, setValue] = React.useState('1');
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [identifier, setIdentifier] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorIdentifier, setErrorIdentifier] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	useEffect(() => {
        if (projectId) {
            handleGetProject();
        }
    }, [projectId]);

	const handleGetProject = () => {
        if (projectId) {
            getProjectById(parseInt(projectId)).then((project: Project) => {
                setName(project.name);
                setDescription(project.description);
                setIdentifier(project.identifier);
                setIsPrivate(!project.isPublic);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

	const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorIdentifier(false);
        setServerErrors([]);
    }

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!description) {
            setErrorDescription(true);
            errorFound = true;
        }
        if (!identifier) {
            setErrorIdentifier(true);
            errorFound = true;
        }
        return errorFound;
    }

	const handleSubmit = () => {
        clearErrors();
		let errorFound = checkForFieldsErrors();
		if (errorFound) {
			return;
		}
        let project = {
            "id": projectId,
            "name": name,
            "description": description,
            "identifier": identifier,
            "is_public": !isPrivate,
        }
        editProject(project).then((project: Project) => {
        }).catch((error) => {
            console.log(error)
            setServerErrors(error.messages);
        });
    }
	
	return(
		<Sidebar>
			<Page>
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Settings" />
				</div>
				<div className="w-full mt-[30px] flex flex-col gap-5">
					{/* <Box sx={{ width: '100%', typography: 'body1' }}>
						<TabContext value={value}>
							<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<TabList onChange={handleChange} aria-label="lab API tabs example">
								<Tab label="Item One" value="1" />
								<Tab label="Item Two" value="2" />
								<Tab label="Item Three" value="3" />
							</TabList>
							</Box>
							<TabPanel value="1">Item One</TabPanel>
							<TabPanel value="2">Item Two</TabPanel>
							<TabPanel value="3">Item Three</TabPanel>
						</TabContext>
					</Box> */}
					<div className="mt-[5px] flex flex-col gap-[20px]">
						<TextField onChange={(e) => setName(e.target.value)} error={errorName} value={name} className="w-full" id="project-name" label="Name" variant="outlined" />
						<TextField onChange={(e) => setIdentifier(e.target.value)} error={errorIdentifier} disabled value={identifier} className="w-full" id="project-identifier" placeholder="project-identifier" label="Identifier" variant="outlined" />
						<TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} value={description} className="w-full" multiline minRows={"2"} maxRows={"4"} id="project-description" label="Description" variant="outlined" />
						<CustomSwitch value={isPrivate} description='Public projects and their contents are openly available on the network.' onClick={setIsPrivate} title="Private" />
					</div>
					<div>
						<PrimaryButton onClick={handleSubmit}>Edit</PrimaryButton>
					</div>
				</div>
			</Page>
		</Sidebar>
	)
};

export default Settings;