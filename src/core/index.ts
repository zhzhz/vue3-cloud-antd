import {useButton} from './Button';
import {useLabel} from  './Label';

export function useStore()
{
    const {buttonInfo, addButton, getButtonInfo} = useButton();
    const {labelInfo, addLabel, getLabelInfo} = useLabel();

    return {buttonInfo, labelInfo, addButton, addLabel, getButtonInfo, getLabelInfo};
}