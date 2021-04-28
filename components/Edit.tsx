import { useState, useEffect, useRef } from 'react';
import { BsX } from 'react-icons/bs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import axios from 'axios';

interface Props{
  editData: any;
  todo: any;
  complete: any;
  enabled: boolean;
  refreshData: ()=>void;
  toggleEditMode: ()=>void;
}

export default function Edit(props: Props){
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>(new Date(0));
  const editRef = useRef<any>();

  useEffect(()=>{
    if(props.enabled){
      const listType = (props.editData.listType=='todo' ? props.todo : props.complete);
      console.log(listType.length);
      for(let i = 0; i < listType.length; i++){
        if(listType[i].id == props.editData.id){
          setTitle(listType[i].title);
          setNote(listType[i].note);
          setDueDate(new Date(listType[i].dueDate));
        }
      }
      document.getElementById('dimmer').style.backgroundColor="rgba(0,0,0,0.4)";
      document.getElementById('dimmer').style.pointerEvents="auto";
      editRef.current.style.transform='translate(0, 0)';
    }else{
      document.getElementById('dimmer').style.backgroundColor=null;
      document.getElementById('dimmer').style.pointerEvents=null;
      editRef.current.style.transform=null;
    }
  }, [props.enabled]);


  const handleSave = async() =>{
    try{
      await axios.post('http://localhost:3000/api/edit',{
        title: title,
        note: note,
        dueDate: dueDate.getTime(),
        id: props.editData.id
      });
      props.refreshData();
      props.toggleEditMode();
    }catch(err: any){
      console.log(err.response);
    }
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
