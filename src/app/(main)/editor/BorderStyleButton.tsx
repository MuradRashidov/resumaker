import { Button } from '@/components/ui/button';
import { on } from 'events';
import { Circle, Square, Squircle, SquircleIcon } from 'lucide-react';
import React from 'react';

interface BorderStyleButtonProps {
    borderStyle: string | undefined;
    onChange: (borderStyle: string) => void;
}
export const BorderStyles = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    SQUIRCLE: 'squircle',
}

const borderStyleList = Object.values(BorderStyles);
export const BorderStyleButton = ({
    borderStyle,
    onChange
}: BorderStyleButtonProps) => {

    function handleClick(event: React.MouseEvent<HTMLButtonElement | MouseEvent>): void {
       const currentIndex = borderStyle? borderStyleList.indexOf(borderStyle): 0;
       const nextIndex = (currentIndex + 1) % borderStyleList.length;
       onChange(borderStyleList[nextIndex]);
    }
    const Icon = borderStyle === BorderStyles.CIRCLE ? Circle : borderStyle === BorderStyles.SQUARE ? Square : Squircle;
    return (
        <Button
            size="icon"
            variant="secondary"
            onClick={handleClick}
            title="Border Style"
        >
            <Icon className="size-5"/>
        </Button>
    );
};