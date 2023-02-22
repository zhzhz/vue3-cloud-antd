
import {jsonParse} from './json_parse'
import {handleTcp508neth, devStartCommu, devsManage} from './communicate'
import {handleButton, handleLabel} from './renderer'



export function sysCtl(info, drawContext)
{
    let myMap = new Map();
    myMap.set("device",handleDevices);
    myMap.set("button",handleButtons);
    myMap.set("label", handleLabels);
    
    //设备处理函数
    let myDevice = new Map();
    myDevice.set("tcp508neth", handleTcp508neth);
    
    let drawCtx = drawContext;
    
    function handleDevices(devices)
    {
      for (let key in devices)
      {
        let device_func;
        if (device_func = myDevice.get(devices[key]["name"]))//不同的设备名采用不同处理函数
        {
          device_func(devices[key]);
        }
      }
    }
    
    //button控件的创建
    function handleButtons(buttons)
    {
      for (let key in buttons)
      {
        //给每个按钮添加类别为button，这样在后续处理上方便一些
        buttons[key]["type"] = "button";
        handleButton(buttons[key], drawCtx);
      }
    }
    
    
    
    function handleLabels(labels)
    {
      for (let key in labels)
      {
        //给每个标签添加类别为label，这样在后续处理上方便一些
        labels[key]["type"] = "label";
        handleLabel(labels[key], drawCtx);
      }
    }
    
    //根据解析得到的js对象初始化设备和构建界面
    for (let key in info) {
      let handle;
    
      if (handle = myMap.get(key))
      {
        //根据key的不同采用不同的处理函数。
        handle(info[key]);
      }
    }

    //开始标签的读操作
    //循环采集showThings中的数据
    //不同的设备拥有不同的showThings
    //遍历不同的设备，查找showThings
    let index = 0;

    for (let i = 1; i <= info.device.length; i++)
    {
        let dev = devsManage[i];

        if (dev.showThings.length)
        {
            //如果有读的数据
            //取出读数据
            function cb(data)
            {
                //设置标签控件的显示
                //data为字符串，先转换为js对象
                let tmp;
                
                if(tmp = jsonParse(data))
                {
                    //再去读下一个数据，直到读到所有数据，再重头读
                    let upDateIndex = index;
                    index++;
                    if (index == dev.showThings.length)
                    {
                        //收集值用于脚本运行
                        dev.getAllNeedValue = true;
                        index = 0;
                    }
    
                    //更新标签
                    let showThing = dev.showThings[upDateIndex];
                    let reactiveThings = dev.reactiveThings[upDateIndex];
                    //showThing.reactive[upDateIndex].text = tmp.result;
                    reactiveThings[upDateIndex].text = tmp.result;
                    //console.log("data from server:", tmp.result);
                    //updateGui();//更新渲染标签

                    //更新标签1的数据，从而更新曲线显示
                    if (showThing.name == "1")
                    {
                      drawContext.handleDevData(Number(tmp.result));
                      //console.log(drawCtx);
                    }

                    if (dev.getAllNeedValue)
                    {
                        //runLua(dev.showThings);
                    }
    
                    devStartCommu(dev.showThings[index],cb);
                }
            }
    
            devStartCommu(dev.showThings[index],cb);
        }
    }
}

// let prjFile_ = '\
// {\
//   "device":[\
//   {"name":"tcp508neth","id":1}],\
//   \
//   "button":[\
//   {"name":"button_on","device_id":[1],"variable":[1],"value":[1],"x":120,"y":0},\
//   {"name":"button_off","device_id":[1],"variable":[1],"value":[0],"x":287,"y":16}],\
//   \
//   "label":[\
//   {"name":"led1","device_id":[1],"variable":[1],"x":201,"y":227}]\
//   }\
// ';

// let prjFile_ = '\
// {\
//   "device":[\
//   {"name":"tcp508neth","id":1}],\
//   \
//   "button":[\
//   {"name":"button_on","device_id":[1],"variable":[1],"value":[1],"x":120,"y":0},\
//   {"name":"button_off","device_id":[1],"variable":[1],"value":[0],"x":287,"y":16}]\
// }\
// ';

let prjFile_ = '\
{\
    "device":[\
    {"name":"tcp508neth","id":1},\
    {"name":"tcp508neth","id":2}],\
    \
    "button":[\
    {"name":"button_on","device_id":[1],"variable":[1],"value":[1],"x":50,"y":20,"width":100, "height":30,"text":"on"},\
    {"name":"button_off","device_id":[1],"variable":[1],"value":[0],"x":200,"y":20,"width":100, "height":30,"text":"off"},\
    {"name":"button_on2","device_id":[1],"variable":[2],"value":[1],"x":50,"y":160,"width":100, "height":30,"text":"on"},\
    {"name":"button_off2","device_id":[1],"variable":[2],"value":[0],"x":200,"y":160,"width":100, "height":30,"text":"off"},\
    {"name":"button_on3","device_id":[1],"variable":[3],"value":[1],"x":50,"y":300,"width":100, "height":30,"text":"on"},\
    {"name":"button_off3","device_id":[1],"variable":[3],"value":[0],"x":200,"y":300,"width":100, "height":30,"text":"off"}],\
    \
    "label":[\
    {"name":"1","device_id":[1],"variable":[1],"x":350,"y":30, "text":"#"},\
    {"name":"2","device_id":[1],"variable":[2],"x":350,"y":170, "text":"#"},\
    {"name":"3","device_id":[1],"variable":[3],"x":350,"y":310, "text":"#"}]\
    }\
}';

// let prjFile_ = '\
// {\
//     "device":[\
//     {"name":"tcp508neth","id":1}],\
//     \
//     "button":[\
//     {"name":"button_on","device_id":[1],"variable":[1],"value":[1],"x":50,"y":100, "width":100, "height":30,"text":"on"},\
//     {"name":"button_off","device_id":[1],"variable":[1],"value":[0],"x":200,"y":100,"width":100, "height":30,"text":"off"}],\
//     \
//     "label":[\
//     {"name":"labelA","device_id":[1],"variable":[1],"x":150,"y":150, "text":"#"}]\
// }';

export function sysInit()
{
  let result = jsonParse(prjFile_);
  console.log(result);

  return result;
}


//sysCtl(result);

