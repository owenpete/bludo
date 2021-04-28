import axios from 'axios';
import fs from 'fs';

export default async function checkItem(req: any, res: any){
  if(req.method === 'POST'){
    try{
      const response: any = await axios.get('http://localhost:3000/api/list');
      const list = await response.data;
      if(req.body.list=='todo'){
        list.complete.push(list.todo[req.body.index]);
        list.todo.splice(req.body.index, 1)
      }else{
        list.todo.push(list.complete[req.body.index]);
        list.complete.splice(req.body.index, 1);
      }
      fs.writeFileSync('./database/list.json', JSON.stringify(list));
      res.status(200).json({success: true});
    }catch(err: any){
      res.status(500).json({err: err});
    }
  }else{
    res.status(500).json({err: 'please post to this endpoint'});
  }
}
