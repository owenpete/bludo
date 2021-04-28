import fs from 'fs';
import axios from 'axios';

export default async function edit(req: any, res: any){
  if(req.method === 'POST'){
    try{
      let list = await axios.get('http://localhost:3000/api/list');
      for(let i = 0; i < list.data.todo.length; i++){
        if(list.data.todo[i].id == req.body.id){
          list.data.todo[i] = {
            title: req.body.title,
            note: req.body.note,
            dueDate: req.body.dueDate,
            id: req.body.id,
          }
          fs.writeFileSync('./database/list.json', JSON.stringify(list.data));
        }
      }
      for(let i = 0; i < list.data.complete.length; i++){
        if(list.data.complete[i].id == req.body.id){
          list.data.complete[i] = {
            title: req.body.title,
            note: req.body.note,
            dueDate: req.body.dueDate,
            id: req.body.id,
          }
          fs.writeFileSync('./database/list.json', JSON.stringify(list.data));
        }
      }
      res.status(200).json({success: true});
    }catch(err: any){
      res.status(500).json({err: err});
    }
  }else{
    res.status(500).json({err: 'please post to this endpoint'});
  }
}
