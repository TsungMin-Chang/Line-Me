"use client";

import { useState } from "react";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import SignInTab from "./SignInTab";
import SignUpTab from "./SignUpTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function AuthForm() {
  const [value, setValue] = useState(0);
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-center mb-2">
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Sign In" {...a11yProps(0)} />
          <Tab label="Sign Up" {...a11yProps(1)} />
        </Tabs>
      </div>
      <CustomTabPanel value={value} index={0}>
        <SignInTab/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SignUpTab/>
      </CustomTabPanel>
    </div>
    
  );
}

export default AuthForm;
