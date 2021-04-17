import { useState, useEffect, useRef } from "react";
import { AiOutlineCheckCircle, AiOutlineEdit, AiOutlineCloseCircle } from "react-icons/ai";
import { FiMenu } from 'react-icons/fi';
import Edit from '../components/Edit';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { v4 as uuidv4 } from 'uuid';
import Task from '../types/Task';

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
}

export default function Main(props: Props) {
  const currentDate = new Date();
  const [pickerDate, setPickerDate] = useState(new Date());
  const [list, setList] = useState<Task[]>([]);
  const [completeList, setCompleteList] = useState<Task[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [task, setTask] = useState<Task>({
    title: "",
    note: "",
    dueDate: pickerDate
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

  const handleTaskSubmit=()=>{
    if(task.title!=""){
      list == undefined ? setList([{...task, id: uuidv4()}]) : setList([...list, {...task, id: uuidv4()}]);
      setTask({title: "", note: "", dueDate: task.dueDate, id: undefined});
    }
  }

  const handleCheck=(e: any)=>{
    if(completeList != []){
      setCompleteList([...completeList, list.slice(0)[0]]);
    }else {
      setCompleteList(list.slice(0,1));
    }
    setList(list.filter((value: any)=>e.target.parentNode.id !== value.id));
  }
  const handleUncheck=(e: any)=>{
    if(list != []){
      setList([...list, completeList.slice(0)[0]]);
    }else {
      setList(completeList.slice(0,1));
    }
    setCompleteList(completeList.filter((value: any)=>e.target.parentNode.id !== value.id));
  }
  const handleRemove=(e: any)=>{
    if(e.target.parentNode.getAttribute('data-type') == 'main'){
      setList(list.filter((value: any)=>e.target.parentNode.id !== value.id));
    }else{
      setCompleteList(completeList.filter((value: any)=>e.target.parentNode.id !== value.id));
    }
  }

  const [editData, setEditData] = useState<any>();
  const toggleEditMode=()=>{
    setEditMode(!editMode);
  }
  const getEditData=(e: any, index: number)=>{
    setEditData({
      listName: e.target.parentNode.getAttribute('data-type'),
      elementIndex: index,
    });
  }

  return (
    <div className="main">
      <div className='main__sidebar'>
        <FiMenu
          className='main__sidebar-icon'
          onClick={props.toggleSidebar}
        />
      </div>
      <Edit
        editData={editData}
        list={list}
        setList={setList}
        completeList={completeList}
        setCompleteList={setCompleteList}
        enabled={editMode}
        toggleEditMode={toggleEditMode}
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
              <label className='create__label' htmlFor="notes">Notes</label>
              <input
                className="main__input main__note-input"
                type="text"
                value={task.note}
                autoComplete='off'
                placeholder="Bring treats."
                onChange={(e: any) => handleNoteChange(e.target.value)}
                onFocus={(e: any) => (e.target.placeholder = "")}
                onBlur={(e: any) => (e.target.placeholder = "Bring treats.")}
              />
            </div>
            <div className="create__label-input">
              <label className='create__label' htmlFor="date">Due Date</label>
              <DatePicker
                className='main__input'
                onKeyDown={(e: any)=>{e.preventDefault(); return false}}
                selected={pickerDate}
                value={format(task.dueDate, "eeee, d MMMM")}
                onChange={(date) => handleDateChange(date)}
                dateFormat="eeee, d MMMM"
              />
            </div>
          </div>
          <div className="create__add-button">
            <button className="create__add" onClick={(e: any)=>handleTaskSubmit()}>Add Item</button>
          </div>
        </div>
      </div>
      {
        list.length==0 ? null : (
          <>
            <h1 className="create__header">To-do</h1>
            <div className="main__todo-list">
              {
                list.map((value: any, index: number)=>{
                  return (
                    <div className="main__todo" id={value.id} data-type='main' key={index}>
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
                        onClick={(e: any)=>{getEditData(e,index); toggleEditMode()}}
                      />
                      <span className="main__title">{value.title}</span>
                      <span className="main__note">{value.note}</span>
                      <span className={
                        `main__due-date ${checkDatePlacement(currentDate, value.dueDate)}`
                        }>{format(value.dueDate, "eeee, d MMMM")}
                      </span>
                    </div>
                  );
                })
              }
            </div>
          </>
        )
      }
      {
        completeList.length==0 ? null : (
          <>
            <h1 className="create__header">Completed</h1>
            <div className="main__completed-list">
              {
                completeList.map((value: any, index: number)=>{
                  return (
                    <div className="main__todo" id={value.id} data-type='complete' key={index}>
                      <AiOutlineCheckCircle
                        className="main__icon main__check-icon--complete"
                        onClick={(e: any)=>handleUncheck(e)}
                      />
                      <AiOutlineCloseCircle
                        className="main__icon main__remove-icon"
                        onClick={(e: any)=>handleRemove(e)}
                      />
                      <AiOutlineEdit
                        className="main__icon main__edit-icon"
                        onClick={(e: any)=>{getEditData(e, index); toggleEditMode()}}
                      />
                      <span className="main__title">{value.title}</span>
                      <span className="main__note">{value.note}</span>
                      <span className={
                        `main__due-date ${checkDatePlacement(currentDate, value.dueDate)}`
                        }>{format(value.dueDate, "eeee, d MMMM")}
                      </span>
                    </div>
                  );
                })
              }
            </div>
          </>
        )
      }
    </div>
  );
}
