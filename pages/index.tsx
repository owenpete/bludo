import { useEffect, useState, useRef } from 'react';
import { FiMenu } from 'react-icons/fi';

import Head from 'next/head'

import Sidebar from '../components/Sidebar';
import Main from '../components/Main';

export default function Home() {
  const [theme, setTheme] = useState<string>("light");
  const toggleSidebarRef = useRef<any>();
  const [sidebarState, setSidebarState] = useState<boolean>(true);
  const toggleSidebar=()=>{
    if(sidebarState){
      toggleSidebarRef.current.style.minWidth=0;
      toggleSidebarRef.current.style.width='0';
    }else{
      toggleSidebarRef.current.style.minWidth=null;
      toggleSidebarRef.current.style.width=null;
    }
    setSidebarState(!sidebarState);
  }

  useEffect(()=>{
    document.body.classList.add(theme);
  });

  return (
    <div className='index'>
      <div id='dimmer'></div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
        toggleSidebarRef={toggleSidebarRef}
        toggleSidebar={toggleSidebar}
      />
      <Main
        toggleSidebar={toggleSidebar}
      />
    </div>
  )
}
