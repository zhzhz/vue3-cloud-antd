
// const net = require('net');
import {Obj2json} from './Obj2json'

let devsManage = [];

function newDev()
{
  let dev = {};
  dev.socketClient = null;

  return dev;
}

//根据dev的类型创建网络连接
//有多少个设备，创建多少个tcp连接
export function startCommuMain(dev)
{

  //根据设备id，创建设备
  let device = devsManage[dev.id];

  if (device == undefined)
  {
    devsManage[dev.id] = newDev();

    device = devsManage[dev.id];

    let socketClient = net.connect({host:'127.0.0.1', port:5000},  () => {
      console.log('connected to server!');
    });
    
    socketClient.on('end', () => {
      console.log('disconnected from server');
    });

    //服务器来数据了，传递给回调函数
    socketClient.on('data', (data) => {
      //console.log("recv server data:", winIsclosed, win);
      //console.log(data.toString());

      //bugfi致主进程报错
      //修复方法，x当退出时，浏览器端被析构，导判断浏览器端是否存在
    //   if (winIsclosed == false)
    //   {
    //     win.webContents.send('dataFromServer', data.toString(), dev.id);
    //   }
    });

    device.socketClient = socketClient;

    //devMap.set(dev.name,socketClient);//修改为根据id来找到设备了，这句可以不要了
  }
}

//进行设备通信
export function devCommuMain(dev, info)
{
  //根据设备名查找设备
  
  //console.log("server devCommu :" + dev.name);

  let device = devsManage[dev.id];
  let socketClient = device.socketClient;

  info.dev_name = dev.name;//将设备名附加到请求中
  socketClient.write(Obj2json(info));//向服务器发送请求
  
}