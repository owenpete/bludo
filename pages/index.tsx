import { useEffect, useState, useRef } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

import Head from 'next/head'

import Sidebar from '../components/Sidebar';
import Main from '../components/Main';

import * as database from '../utils/database';
import axios from 'axios';
import { useRouter } from 'next/router';

export const getServerSideProps = async() =>{
  let res: any;
  try{
    res = await axios.get('http://localhost:3000/api/list');
  }
  catch(err: any){
    res = {value: 'err'}
  }
  return {
    props: {
      list: res.data
    }
  }
}

interface Props{
  list: any;
}

export default function Home(props: Props) {
  const router = useRouter();

  const refreshData = () =>{
    router.replace(router.asPath);
  }
  const [editMode, setEditMode] = useState<boolean>(false);
  const toggleEditMode=()=>{
    setEditMode(!editMode);
  }

  const [page, setPage] = useState<any>('all');
  const [theme, setTheme] = useState<string>('');
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
    if(document.body.classList.contains('dark')){
      setTheme('dark');
    }else{
      setTheme('light');
    }
  }, []);

  const handleTheme = () =>{
    document.body.classList.toggle('dark');
    setTheme(theme=='dark'? 'light' : 'dark');
  }

  return (
    <div className='index'>
      <div id='dimmer' onClick={toggleEditMode}></div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main
        toggleSidebar={toggleSidebar}
        todo={props.list.todo}
        complete={props.list.complete}
        refreshData={refreshData}
        editMode={editMode}
        toggleEditMode={toggleEditMode}
      />
      <div className='index__theme-toggle' onClick={handleTheme}>
        {
          theme=='dark' ? <FiSun /> : <FiMoon />
        }
      </div>
    </div>
  )
}
      //<Sidebar
        //sidebarState={sidebarState}
        //setSidebarState={setSidebarState}
        //toggleSidebarRef={toggleSidebarRef}
        //toggleSidebar={toggleSidebar}
      ///>
