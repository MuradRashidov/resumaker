import React, { useEffect, useState } from "react";

export default function useDimensions(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const [dimensions, setDimensions] = useState<{width:number, height:number}>({width:0,height:0 });

  useEffect(() => {
    const currentRef = containerRef.current;

    function getDimensions() {
        
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    }

    const resizeObserver = new ResizeObserver((entries) => {
       
    //     console.log(entries);
        
    const entry = entries[0];
    //   console.log(entries[0]);
      
     if (entry) {
    //   previousWidth = width;
      setDimensions(getDimensions());
    }
      
    });

    if (currentRef) {
      resizeObserver.observe(currentRef);
      setDimensions(getDimensions());
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}