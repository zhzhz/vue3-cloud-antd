
// const net = require('net');
import {Obj2json} from './Obj2json'
import { io } from "socket.io-client";

import {callCbFunc} from './devComu'

let devsManage = [];

function newDev()
{
  let dev = {};
  dev.socketClient = null;

  return dev;
}

//根据dev的类型创建网络连接
//有多少个设备，创建多少个Socket.IO连接
export function startCommuMain(dev)
{

  //根据设备id，创建设备
  let device = devsManage[dev.id];

  if (device == undefined)
  {
    devsManage[dev.id] = newDev();

    device = devsManage[dev.id];

    const socketClient = io("http://localhost:3000");

    //服务器来数据了，传递给回调函数
    socketClient.on('serverRes', (data) => {
      //将服务器传来的json字符串返回给系统
      callCbFunc(data, dev.id);
    });

    device.socketClient = socketClient;
  }
}

//进行设备通信
export function devCommuMain(dev, info)
{
  //根据设备id查找设备

  let device = devsManage[dev.id];
  let socketClient = device.socketClient;

  info.dev_name = dev.name;//将设备名附加到请求中
  
  //向服务器发送请求
  socketClient.emit('clientReq', info);
}