import fs from 'fs';
import axios from 'axios';

export default async function removeItem(req: any, res: any){
  if(req.method === 'POST'){
    try{
      const response: any = await axios.get('http://localhost:3000/api/list');
      const list = await response.data;
      req.body.list=='todo'? list.todo.splice(req.body.index, 1) : list.complete.splice(req.body.index, 1);
      fs.writeFileSync('./database/list.json', JSON.stringify(list));
      res.status(200).json({success: true});
    }catch(err: any){
      res.status(500).json({err: err});
    }
  }else{
    res.status(500).json({err: 'please post to this endpoint'});
  }
}
