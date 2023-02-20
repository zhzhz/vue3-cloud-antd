import {ref, onMounted, reactive} from 'vue';
import type {info} from './types'


export function useButton()
{
    const buttonInfo:any = reactive([]);

    // buttonInfo.push({
    //     x: 0,
    //     y: 0,
    //     width: 100,
    //     height: 30,
    //     text:'button1',
    // });

    // buttonInfo.push({
    //     x: 0,
    //     y: 100,
    //     width: 100,
    //     height: 30,
    //     text:'button2',
    // });

    // buttonInfo.push({
    //     x: 200,
    //     y: 200,
    //     width: 100,
    //     height: 30,
    //     text:'button3',
    // });

    function addButton(info:info)
    {
        buttonInfo.push({
            x: info.x,
            y: info.y,
            width: info.width,
            height: info.height,
            text:info.text,
            info:info,
        });
    }

    function getButtonInfo()
    {
        return buttonInfo;
    }

    return {buttonInfo, addButton, getButtonInfo};
}