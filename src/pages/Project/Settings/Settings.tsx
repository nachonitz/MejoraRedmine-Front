import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../../components/Shared/Page/PageTitle/PageTitle';
import Page from '../../../components/Shared/Page/Page';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const Settings = () => {
	const { projectId } = useParams();
	const [value, setValue] = React.useState('1');

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	useEffect(() => {

    }, []);
	
	return(
		<Sidebar>
			<Page>
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Settings" />
				</div>
				<div>
				<Box sx={{ width: '100%', typography: 'body1' }}>
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
				</Box>
				</div>
			</Page>
		</Sidebar>
	)
};

export default Settings;