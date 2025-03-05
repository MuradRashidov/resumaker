"use client"
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { PaletteIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Color, ColorChangeHandler, TwitterPicker } from 'react-color';
import { useSubscriptionLevel } from '../SubscriptionLevelProvider';
import usePremiumModal from '@/components/premium/usePremiumModal';
import { canUseCustomizations } from '@/lib/permissions';

interface ColorPickerProps {
    color: Color | undefined;
    onchange: ColorChangeHandler
}

const ColorPicker = ({
    color,
    onchange,
}: ColorPickerProps) => {
    const subscriptionLevel = useSubscriptionLevel();
    const premiumModal = usePremiumModal();
    const [showPopover, setShowPopover] = useState(false);
    return (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    title="Change color"
                    onClick={() => {
                        if(!canUseCustomizations(subscriptionLevel)) {
                            premiumModal.setOpen(true);
                            return;
                        }
                        setShowPopover(!showPopover);
                    }}
                >
                    <PaletteIcon className='size-5' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="outline-none bg-transparent shadow-none" align="end">
                <TwitterPicker color={color} onChange={onchange} triangle="top-right" />
            </PopoverContent>
        </Popover>
    );
};

export default ColorPicker;