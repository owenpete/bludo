import{ useState, useEffect, useRef } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { FiArrowLeft} from 'react-icons/fi';

interface Props{
  sidebarState: any;
  setSidebarState: any;
  toggleSidebar: any;
  toggleSidebarRef: any;
}

export default function Sidebar(props: Props){

  return (
    <div className='sidebar' ref={props.toggleSidebarRef}>
      <h1 className='sidebar__header'>Bludo</h1>
      <div className='sidebar__list'>
        <div className='sidebar__list-element sidebar__list-element--active'><a className="sidebar__button">All</a></div>
        <div className='sidebar__create-list'>
          <IoAddCircleOutline className='create-list__icon'/>
          <span className='create-list__text'>Create New List</span>
        </div>
      </div>
      <div
        className='sidebar__icon-wrapper'
        ref={props.toggleSidebarRef}
        onClick={props.toggleSidebar}
      >
        <FiArrowLeft className='sidebar__icon'/>
      </div>
    </div>
  );
}
