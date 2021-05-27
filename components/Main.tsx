import { useState, useEffect, useRef } from "react";
import { AiOutlineCheckCircle, AiOutlineEdit, AiOutlineCloseCircle } from "react-icons/ai";
import { FiMenu } from 'react-icons/fi';
import Edit from '../components/Edit';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { v4 as uuidv4 } from 'uuid';
import Task from '../types/Task';

import axios from 'axios';

const checkDatePlacement = (currDate: Date, dueDate: Date) =>{
  const className = 'main__due-date';

  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();
  const currDay = currDate.getDate();

  const dueYear = dueDate.getFullYear();
  const dueMonth = dueDate.getMonth();
  const dueDay = dueDate.getDate();

  //determines task due date in relation to the current date and adds appropriate styling
  if((dueYear > currYear) || (dueYear == currYear && dueMonth > currMonth) || (dueYear == currYear && dueMonth == currMonth && dueDay > currDay)){
    return `${className}--future`;
  }else if(dueYear == currYear && dueMonth == currMonth && dueDay == currDay){
    return `${className}--current`;
  }else{
    return `${className}--past`;
  }
}

interface Props{
  toggleSidebar: any;
  todo: any;
  complete: any;
  refreshData: any;
  editMode: any;
  toggleEditMode: any;
}

export default function Main(props: Props) {
  useEffect(()=>{
    console.log(props.todo.length)
  })
  const currentDate = new Date();
  const [pickerDate, setPickerDate] = useState(new Date());
  const [task, setTask] = useState<Task>({
    title: "",
    note: "",
    dueDate: pickerDate,
  });

  const handleTitleChange = (title: string) =>{
    setTask({...task, title: title});
  }
  const handleNoteChange = (note: string) =>{
    setTask({...task, note: note});
  }
  const handleDateChange = (date: Date) =>{
    setTask({...task, dueDate: date});
  }

  const handleTaskSubmit= async()=>{
    if(task.title != ""){
      try {
        const response = await axios.post('http://localhost:3000/api/addItem',{
          title: task.title,
          note: task.note,
          dueDate: task.dueDate.getTime(),
          id: uuidv4()
        });
        props.refreshData();
        setTask({title: "", note: "", dueDate: currentDate, id: ""});
      } catch (err: any) {
        console.log(err.response);
      }
    }
  }

  const handleCheck=async(e: any)=>{
    try{
      const res: any = await axios.get('http://localhost:3000/api/list');
      const todo = await res.data.todo;
      const complete = await res.data.complete;
      for(let i = 0; i < todo.length; i++){
        if(todo[i].id == e.target.parentElement.parentElement.id){
          await axios.post('http://localhost:3000/api/checkItem', {index: i, list: 'todo'});
        }
      }
      for(let i = 0; i < complete.length; i++){
        if(complete[i].id == e.target.parentElement.parentElement.id){
          await axios.post('http://localhost:3000/api/checkItem', {index: i, list: 'complete'});
        }
      }
    }catch(err: any){
      console.log(err.response);
    }
    props.refreshData();
  }

  const handleRemove=async(e: any)=>{
    try{
      const res: any = await axios.get('http://localhost:3000/api/list');
      const todo = await res.data.todo;
      const complete = await res.data.complete;
      for(let i = 0; i < todo.length; i++){
        if(todo[i].id == e.target.parentElement.parentElement.id){
          await axios.post('http://localhost:3000/api/removeItem', {index: i, list: 'todo'});
        }
      }
      for(let i = 0; i < complete.length; i++){
        if(complete[i].id == e.target.parentElement.parentElement.id){
          await axios.post('http://localhost:3000/api/removeItem', {index: i, list: 'complete'});
        }
      }
    }catch(err: any){
      console.log(err.response);
    }
    props.refreshData();
  }

  const [editData, setEditData] = useState<any>();
  const getEditData=(e: any, index: number)=>{
    setEditData({
      listType: e.target.parentElement.parentElement.getAttribute('data-type'),
      id: e.target.parentElement.parentElement.id
    });
  }

  return (
    <div className="main">
      <Edit
        editData={editData}
        todo={props.todo}
        complete={props.complete}
        enabled={props.editMode}
        refreshData={props.refreshData}
        toggleEditMode={props.toggleEditMode}
      />
      <h1 className="create__header">Create Task</h1>
      <div className="main__create-container">
        <div className="main__create">
          <div className="main__input-container">
            <div className="create__label-input">
              <label className='create__label' htmlFor="title">Title</label>
              <input
                className="main__input main__title-input"
                id="title"
                type="text"
                value={task.title}
                autoComplete='off'
                placeholder="e.g. Walk the dog."
                onKeyDown={(e: any)=>e.key=='Enter'?handleTaskSubmit():false}
                onChange={(e: any) => handleTitleChange(e.target.value)}
                onFocus={(e: any) => (e.target.placeholder = "")}
                onBlur={(e: any) =>(e.target.placeholder = "e.g Walk the dog.")}
              />
            </div>
            <div className="create__label-input">
              <label className='create__label' htmlFor="date">Due Date</label>
              <DatePicker
                className='main__input'
                onKeyDown={(e: any)=>{e.preventDefault(); return false}}
                selected={pickerDate}
                value={format(task.dueDate, "eeee, d MMMM")}
                onChange={(date: any) => handleDateChange(date)}
                dateFormat="eeee, d MMMM"
              />
            </div>
          </div>
          <div className="create__add-button">
            <button className="create__add" onClick={(e: any)=>handleTaskSubmit()}>Add Item</button>
          </div>
        </div>
      </div>
      {props.todo.length!==0&&
        <>
          <h1 className="create__header">To-do</h1>
          <div className="main__todo-list">
            {
              props.todo.map((value: any, index: number)=>{
                return (
                  <div className="main__todo" id={value.id} data-type='todo' key={index}>
                    <div className='main__actions'>
                      <AiOutlineCheckCircle
                        className="main__icon main__check-icon"
                        onClick={(e: any)=>handleCheck(e)}
                      />
                      <AiOutlineCloseCircle
                        className="main__icon main__remove-icon"
                        onClick={(e: any)=>handleRemove(e)}
                      />
                      <AiOutlineEdit
                        className="main__icon main__edit-icon"
                        onClick={(e: any)=>{getEditData(e,index); props.toggleEditMode()}}
                      />
                    </div>
                    <span className="main__title">{value.title}</span>
                    <span className={
                      `main__due-date ${checkDatePlacement(currentDate, new Date(value.dueDate))}`
                      }>{format(value.dueDate, "eeee, d MMMM")}
                    </span>
                  </div>
                );
              })
            }
          </div>
        </>
      }
      {props.complete.length!==0&&
        <>
          <h1 className="create__header">Completed</h1>
          <div className="main__completed-list">
            {props.complete&&
              props.complete.map((value: any, index: number)=>{
                return (
                  <div className="main__todo" id={value.id} data-type='complete' key={index}>
                    <div className='main__actions'>
                      <AiOutlineCheckCircle
                        className="main__icon main__check-icon--complete"
                        onClick={(e: any)=>handleCheck(e)}
                      />
                      <AiOutlineCloseCircle
                        className="main__icon main__remove-icon"
                        onClick={(e: any)=>handleRemove(e)}
                      />
                      <AiOutlineEdit
                        className="main__icon main__edit-icon"
                        onClick={(e: any)=>{getEditData(e, index); props.toggleEditMode()}}
                      />
                    </div>
                    <span className="main__title">{value.title}</span>
                    <span className={
                      `main__due-date ${checkDatePlacement(currentDate, new Date(value.dueDate))}`
                      }>{format(value.dueDate, "eeee, d MMMM")}
                    </span>
                  </div>
                );
              })
            }
          </div>
        </>
      }
    </div>
  );
}
      //<div className='main__sidebar'>
        //<FiMenu
          //className='main__sidebar-icon'
          //onClick={props.toggleSidebar}
        ///>
      //</div>
//
            //<div className="create__label-input">
              //<label className='create__label' htmlFor="notes">Notes</label>
              //<input
                //className="main__input main__note-input"
                //type="text"
                //value={task.note}
                //autoComplete='off'
                //placeholder="Bring treats."
                //onChange={(e: any) => handleNoteChange(e.target.value)}
                //onFocus={(e: any) => (e.target.placeholder = "")}
                //onBlur={(e: any) => (e.target.placeholder = "Bring treats.")}
              ///>
            //</div>
