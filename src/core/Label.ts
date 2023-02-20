import {ref, onMounted, reactive} from 'vue';
import type {info} from './types'

export function useLabel()
{
    const labelInfo:any = reactive([]);

    // labelInfo.push({
    //     x: 150,
    //     y: 0,
    //     // width: 100,
    //     // height: 30,
    //     text:'Label1',
    // });

    // labelInfo.push({
    //     x: 50,
    //     y: 200,
    //     // width: 100,
    //     // height: 30,
    //     text:'Label2',
    // });

    // labelInfo.push({
    //     x: 200,
    //     y: 100,
    //     // width: 100,
    //     // height: 30,
    //     text:'Label3',
    
    function addLabel(info:info)
    {
        labelInfo.push({
            x: info.x,
            y: info.y,
            // width: 100,
            // height: 30,
            name:info.name,
            text:info.text,
        });
    }

    function getLabelInfo()
    {
        return labelInfo;
    }

    return {labelInfo, addLabel, getLabelInfo};
}