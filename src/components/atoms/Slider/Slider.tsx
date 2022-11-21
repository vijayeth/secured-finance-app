import SliderUnstyled from '@mui/base/SliderUnstyled';
import { useCallback } from 'react';

const marks = [
    { value: 0 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 },
];

export const Slider = ({ onChange }: { onChange: (value: number) => void }) => {
    const handleChange = useCallback(
        (_event: Event, value: number | number[], _activeThumb: number) => {
            onChange(value as number);
        },
        [onChange]
    );
    return (
        <SliderUnstyled
            marks={marks}
            onChange={handleChange}
            classes={{ markActive: 'slider-markActive' }}
            slotProps={{
                thumb: {
                    className:
                        'ring-starBlue-80 ring-[5px] w-3 h-3 -mt-[5px] -ml-[5px] bg-white rounded-full shadow-sliderthumb absolute',
                },
                root: {
                    className:
                        'w-full relative inline-block h-[2px] cursor-pointer',
                },
                rail: {
                    className: 'bg-neutral-3 h-2px w-full block absolute',
                },
                track: {
                    className: 'bg-starBlue h-2px absolute',
                },
                mark: {
                    className:
                        'rounded-sm h-6px w-2px absolute -mt-[2px] bg-neutral-4',
                },
            }}
        />
    );
};
