import {startCommuMain, devCommuMain} from './deviceComu.js'

let devsManage = [];

export function startCommu(dev)
{
    startCommuMain(dev);
}

export function devCommu(dev, info, cb)
{
    let dev_id = dev.id;

    devsManage[dev_id] = cb;

    devCommuMain(dev, info);
}

// ipcRenderer.on('dataFromServer', function(event, message, dev_id) 
// {
//   //console.log("dataFromServer: " + message);
  
//   devsManage[dev_id](message);
// });