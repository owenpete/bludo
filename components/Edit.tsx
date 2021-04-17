import { useState, useEffect, useRef } from 'react';
import { BsX } from 'react-icons/bs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";

interface Props{
  editData: any;
  list: any;
  setList: any;
  completeList: any;
  setCompleteList: any;
  enabled: boolean;
  toggleEditMode: ()=>void;
}

export default function Edit(props: Props){
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>(new Date(0));
  const editRef = useRef<any>();

  useEffect(()=>{
    if(props.enabled){
      const listType = (props.editData.listName=='main' ? props.list : props.completeList)[props.editData.elementIndex];
      setTitle(listType.title);
      setNote(listType.note);
      setDueDate(listType.dueDate);
      document.getElementById('dimmer').style.backgroundColor="rgba(0,0,0,0.4)";
      document.getElementById('dimmer').style.pointerEvents="auto";
      editRef.current.style.transform='translate(0, 0)';
    }else{
      document.getElementById('dimmer').style.backgroundColor=null;
      document.getElementById('dimmer').style.pointerEvents=null;
      editRef.current.style.transform=null;
    }
  }, [props.enabled]);


  const handleSave = () =>{
    const task = {title: title, note: note, dueDate: dueDate};
    if(props.editData.listName == 'main'){
      props.setList([
        ...props.list.slice(0, props.editData.elementIndex),
        {
          ...props.list[props.editData.elementIndex],
          ...task,
        },
        ...props.list.slice(props.editData.elementIndex+1)
      ]);
    }else{
      props.setCompleteList([
        ...props.completeList.slice(0, props.editData.elementIndex),
        {
          ...props.completeList[props.editData.elementIndex],
          ...task,
        },
        ...props.completeList.slice(props.editData.elementIndex+1)
      ]);
    }
    props.toggleEditMode();
  }

  return (
    <div className='edit' ref={editRef} >
      <h1 className='edit__header'>Edit</h1>
      <BsX className='edit__close-button' onClick={props.toggleEditMode} />
      <div className='edit__label-input'>
        <label className='edit__label'>Title</label>
        <input className='edit__input' type='text' value={title} onChange={(e: any)=>setTitle(e.target.value)}/>
      </div>
      <div className='edit__label-input'>
        <label className='edit__label'>Note</label>
        <input className='edit__input' type='text' value={note} onChange={(e: any)=>setNote(e.target.value)} />
      </div>
      <div className='edit__label-input'>
        <label className='edit__label'>Due Date</label>
        <DatePicker
          className='edit__input'
          onKeyDown={(e: any)=>{e.preventDefault(); return false}}
          selected={dueDate}
          value={format(dueDate, "eeee, d MMMM")}
          onChange={(date) => setDueDate(date)}
          dateFormat="eeee, d MMMM"
        />
      </div>
      <div className='edit__actions'>
        <button className='edit__button edit__save' onClick={handleSave}>Save</button>
        <button className='edit__button edit__cancel' onClick={props.toggleEditMode}>Cancel</button>
      </div>
    </div>
  );
}
