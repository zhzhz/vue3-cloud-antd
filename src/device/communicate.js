
import {startCommu} from './devComu';
import {devCommu as maindevCommu} from './devComu';
let devices = new Map();



export let devsManage = [];

function newDev()
{
  let dev = {};
  dev.isHandleWrite =false;
  dev.writeArray = [];
  dev.writeCb = [];

  dev.showThings = [];
  dev.reactiveThings = [];

  dev.getAllNeedValue = false;

  return dev;
}

//处理Tcp508neth设备
export function handleTcp508neth(device)
{
  console.log("new dev:" + device["name"] + " id is " + device["id"]);
  //当前设备是网络设备，创建网络连接
  startCommu(device);

  let dev = devsManage[device.id];

  if (dev == undefined)
  {
    devsManage[device.id] = newDev();
  }

  devices.set(device.id, device);
}

function devCommu(info, cb)
{
  //根据按钮对应的设备id，得到设备
  let device;
  let dev_num = info.device_id[0];//取出按钮对应的设备id

  if (device = devices.get(dev_num))
  {
    maindevCommu(device, info, cb);
  }
}

//开始设备读写操作
//如果有写数据，则先处理
export function devStartCommu(info, cb)
{
  let dev_num = info.device_id[0];
  let dev = devsManage[dev_num];

  if (dev.writeArray.length)
  {
    dev.isHandleWrite = true;

    //有写操作，将最前面的出数组，发送写指令
    let info_ = dev.writeArray.shift();
    let cb_ = dev.writeCb.shift();

    //记录读请求
    let backInfo= info;
    let backCb= cb;

    //我们构造一个回调函数来处理写完成之后的操作
    devCommu(info_, (data)=>{
      dev.isHandleWrite = false;

      cb_(data);//首先调用用户的回调函数

      //写操作完成后，如果有读操作，继续通信，不过先处理剩余的写操作，处理完写操作，如果有读操作，继续读操作
      if (dev.showThings.length)
      {
        devStartCommu(backInfo, backCb);
      }
      else
      {
        //只有写操作,如果当前写操作之后还有写操作，继续处理写操作，直到处理完所有
        if (dev.writeArray.length)
        {
          devStartCommu(dev.writeArray[0], dev.writeCb[0]);
        }
      }
    });
  }
  else
  {
    //读操作
    devCommu(info, cb);//单纯的读操作是不会引发冲突的
  }
}


//将写操作及回调函数记录下来
export function devWriteCommu(info, cb)
{
  let dev_num = info.device_id[0];
  let dev = devsManage[dev_num];

  if (dev.showThings.length)
  {
    //如果有读事件，将写请求写入缓冲区，等待处理
    dev.writeArray.push(info);
    dev.writeCb.push(cb);
  }
  else
  {
    //如果没有读事件，且当前不在处理写请求
    dev.writeArray.push(info);
    dev.writeCb.push(cb);

    if (dev.isHandleWrite == false)
    {
      devStartCommu(info, cb);//如果当前没有在处理写请求，主动调用
    }
  }
}