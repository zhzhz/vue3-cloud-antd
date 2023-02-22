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

//服务器传来响应数据，调用用户注册的回调函数
export function callCbFunc(message, dev_id)
{
    devsManage[dev_id](message);
}