import fs from 'fs';

export default function list(req: any, res: any){
  const path = './database/';
  try{
    if(!fs.existsSync(`${path}list.json`)){
      try{
        fs.mkdirSync(path);
        fs.writeFileSync(`${path}list.json`, JSON.stringify({
            todo: [],
            complete: []
          }
        ));
        res.status(200).json('success');
      }catch(err){
        res.status(500).json({err: err});
      }
    }else{
      try{
        const response = fs.readFileSync(`${path}list.json`);
        res.status(200).json(response);
      }
      catch(err: any){
          res.status(200).json({err: 'read error '+err});
      }
    }
  }catch(err: any){
    res.status(500).json({err: err});
  }
}
