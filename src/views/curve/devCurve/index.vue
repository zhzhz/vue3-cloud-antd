<template>
    <!-- 曲线控件 -->
    <div id="main-echarts" style="width: 1200px;height:800px;"></div>
</template>

<script setup lang="ts">
    import {onMounted} from 'vue'

    import * as echarts from 'echarts'

    import {useDevDataStore} from '@/store/modules/devData'

    import { Application } from "pixi.js";

    const game = new Application({
    width: 750,
    height: 1080,
    });

    const devDataStore = useDevDataStore();

    const devData = [];//曲线数据，对应x轴

    let devDataCntInit = true;
    
    enum DevData {
        Length = 300,//点的个数，30s/0.1ms=300
        Interval = 100,//时间间隔，单位ms
    }


    //曲线显示时间标签转换函数
    function timestampToTime(timestamp)
    {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        
        //return Y + M + D + h + m + s;
        return m + s;
    }

    const option = {
        animation: false,
          title:{
            text:'曲线图',
          },
          tooltip:{
            formatter: function (params) {
              return (
                '时间: ' +
                timestampToTime(params.data[0]) +
                '<br>' + params.seriesName + ': ' +
                params.data[1]
              );
            }
          },
          legend: {
            data: ['功率','温度'],
            selected: {
              //'功率': true,
              //'温度': false,
            },
          },
          xAxis:{
              //data: xAxisLabel,
              //type: 'category',
              min:-1,
              max:-1,
              interval:3000,
              type: 'value',
              boundaryGap : false,
              axisLine: {
                lineStyle: {
                  type: 'dashed',
                }},
              axisLabel:{
                color:'red',
                //interval:1
                //rotate:30,
                formatter:function(e)
                {
                  return timestampToTime(e);
                }
              },
          },
          yAxis:{},
          series:[{
            name:'功率',
            //type:'bar',
            type:'line',
            //data: powerData,
            data:[],
            //data: [[1642574525000,10],[1647672125000,20],[1652942525000,30]],
            symbol: 'none',
          },
          {
            name:'温度',
            //type:'bar',
            type:'line',
            //data: tmpData,
            data:[],
            //data: [[1642574525000,20],[1647672125000,40],[1652942525000,30]],
            symbol: 'none',
          },
          ],
          dataZoom:[
            {
              type: 'slider',
              xAxisIndex: 0,
              top:-5,
              minSpan:2,
              filterMode: 'none',
              start:0,
              end:100,
            },
            {
              type: 'slider',
              yAxisIndex: 0,
              minSpan:2,
              filterMode: 'none',
              start:0,
              end:100,
            },
            {
              type: 'inside',
              xAxisIndex: 0,
              filterMode: 'none'
            },
            {
              type: 'inside',
              yAxisIndex: 0,
              filterMode: 'none'
            }
          ],

    };

    onMounted(()=> {
        const myChart = echarts.init(document.getElementById('main-echarts'));
        //console.log("myChart", myChart);

        //配置echarts
        myChart.getZr().on('click', function(params){
            if (params.target)
            {
            ;
            }
            else
            {
            //alert(myChart.options.dataZoom[0].top);
            option.dataZoom[0].start = 0;
            option.dataZoom[0].end = 100;

            option.dataZoom[1].start = 0;
            option.dataZoom[1].end = 100;
            myChart.setOption(option);
            }
            
        })

        myChart.setOption(option);

        let cnt = 0;
        let ms_200Cnt = 0;

        //定时去读取采集回来的设备变量，渲染出来
        const handleTicker =  () => {
            //console.log("定时器事件", devDataStore.getDevData);
            //定时生成30s的时间戳和30s的数据
            function genTime(timeLength:number)
            {
                let times = [];
                const timestamp = Date.parse(String(new Date()));
                let timeNumber = Number(timestamp);

                for (let i = timeLength-1; i >= 0; i--)
                {
                    times[i] = timeNumber;
                    timeNumber -= DevData.Interval;
                }

                //console.log("times", times);
                return times;
            }

            ms_200Cnt++;
            if (ms_200Cnt == 6)
            {
                ms_200Cnt = 0;

                if (devDataCntInit)
                {
                    if (devDataStore.getDevData != -1)
                    {
                        //初始化
                        let times = genTime(DevData.Length);

                        //时间只有最新的一个有效，其他为null
                        let datas = [];
                        let i = 0; 
                        for (; i < DevData.Length-1; i++)
                        {
                            datas[i] = null;
                        }

                        datas[i] = devDataStore.getDevData;
                        //console.log("option0:",datas);
                        //覆盖曲线配置
                        let echartsData = [];
                        for (let i = 0; i < DevData.Length; i++)
                        {
                            let powerWithTime:Array<number | null> = [];
                            powerWithTime.push(times[i]);
                            powerWithTime.push(datas[i]);

                            echartsData.push(powerWithTime);
                        }
                        
                        //向option中压入数值
                        for(let i = 0; i < echartsData.length; i++)
                        {
                            option.series[0].data.push(echartsData[i]);
                        }
                        
                        console.log("option2:",echartsData);
                        //console.log("option2:",option.series[0].data);

                        //设置最小时间，否则从0开始显示，曲线只能看见一条竖线 
                        option.xAxis.min = times[0];
                        option.xAxis.max = times[DevData.Length-1];

                        myChart.setOption(option);//更新曲线图像

                        devDataCntInit = false;
                    }
                }
                else
                {
                    //不断向数组中添加数据，填充后面，取出前面
                    //取出最后一个时间元素，加1s
                    
                    //const timestamp = Date.parse(String(new Date()));
                    let date = new Date();
                    
                    //let time = Number(timestamp);
                    let time = date.valueOf();
                    //console.log("time", time);

                    let data = devDataStore.getDevData;

                    //取出data值，处理后再写入
                    let tmpData = [];
                    for (let i = 0; i < DevData.Length; i++)
                    {
                        tmpData.push(option.series[0].data[i]);
                    }

                    tmpData.shift();//去除最早的元素

                    tmpData.push([time, data]);//加入最新的元素

                    //向option中压入数值
                    option.series[0].data = [];

                    for(let i = 0; i < tmpData.length; i++)
                    {
                        option.series[0].data.push(tmpData[i]);
                    }

                    //最小值不用最新的时间，而是用过去30s的时间
                    //option.xAxis.min = option.series[0].data[0][0];
                    option.xAxis.min = time - 30*1000;
                    option.xAxis.max = time;

                    //option.series[0].data[0][0] = option.xAxis.min;

                    //设置10个标签
                    //option.xAxis.interval = (option.xAxis.max - option.xAxis.min)/10;
                    
                    myChart.setOption(option);//更新曲线图像
                    cnt++;
                    if (cnt == 1000/DevData.Interval)
                    {
                        //myChart.setOption(option);//更新曲线图像
                        cnt = 0;

                        //显示时间的开始与结束
                        let time_ = timestampToTime(time - option.xAxis.min);
                        if((time_ != "00:30") && (time_ != "00:31") && (time_ != "00:29"))
                        {
                            console.log("time", time_, timestampToTime(time))
                        }
                            
                    }
                    
                }
            }
            
        }

        game.ticker.add(handleTicker);
    })
    
</script>