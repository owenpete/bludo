import fs from 'fs';
import axios from 'axios';

export default async function addItem(req: any, res: any){
  if(req.method === 'POST'){
    try{
      const response: any = await axios.get('http://localhost:3000/api/list');
      const data: any = await response.data;
      const list: any = {
        todo: [
          ...data.todo,
          {
            title: req.body.title,
            note: req.body.note,
            dueDate: req.body.dueDate,
            id: req.body.id
          }
        ],

        complete: [
          ...data.complete
        ]
      };
      try{
        fs.writeFileSync('./database/list.json',JSON.stringify(list));
        res.status(200).json({value: "good"});
      }catch(err: any){
        res.status(500).json({err: err});
      }
    }catch(err: any){
      res.status(500).json(err)
    }
  }else{
    res.status(200).json({message: 'please post to this endpoint'});
  }
}
