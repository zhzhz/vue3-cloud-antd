<template>
    <!-- 根据解析得到的json构建界面 -->
    <div v-for="(label, index_) in labelInfo"
        :key="index_">

        <a-button v-for="(button, index) in buttonInfo.slice(index_*2, index_*2+2)"
        :key="index"
        type="primary" @click="handleButtonDown(button.info)">{{button.text}}</a-button>

        <div class="breakStateDiv">
        <Text class="labelBreak">断路器{{label.name}}状态:</Text>
        <Text>{{label.text}}</Text>
        </div>
    </div>
</template>

<script setup lang="ts">

import {ref, onMounted, reactive, toRaw} from 'vue';
import {useStore} from "@/core"

import {sysInit, sysCtl} from '@/device/sysCtl';
import {devWriteCommu} from '@/device/communicate'
import {jsonParse} from '@/device/json_parse'

import { io } from "socket.io-client";

const {buttonInfo, labelInfo, addButton, addLabel, getButtonInfo, getLabelInfo} = useStore();


// let sysInfo = sysInit();//解析配置文件

// sysCtl(sysInfo, {
//   handleButton,
//   handleLabel,
//   getButtonInfo,
//   getLabelInfo
// });//根据配置文件，配置系统
const socket = io("http://localhost:3000");
socket.emit('clientReq', 'Sent an event from the client!');
socket.on('serverRes', function(data){console.log(data.description)});

function handleButton(info)
{
  addButton(info);
}

function handleLabel(info)
{
  addLabel(info);
}

function handleButtonDown(buttonInfo)
{
//调用设备通信函数，进行通信
    let rawButtonInfo = toRaw(buttonInfo);
    devWriteCommu(rawButtonInfo, (data)=>{
      //console.log("browser server data:");
      //console.log(data);
      let tmp;
      if (tmp = jsonParse(data))
      {
          if(tmp.result == "ok")
          {
              console.log(rawButtonInfo.name + "成功");
          }
      }
    });
}


</script>

<style lang="less" scoped>
</style>