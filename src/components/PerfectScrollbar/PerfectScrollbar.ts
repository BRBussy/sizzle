import PerfectScrollbar from 'perfect-scrollbar';
import {useLayoutEffect, useState} from 'react';

export default function usePerfectScrollbar(
    suppressScrollX: boolean = true,
    suppressScrollY: boolean = false
) {
    const [scrollBarElementRef, setScrollBarElementRef] = useState<null | HTMLDivElement>(null);
    const [, setPerfectScrollbarInst] = useState<null | PerfectScrollbar>(null);

    useLayoutEffect(() => {
        if (scrollBarElementRef) {
            try {
                setPerfectScrollbarInst(
                    new PerfectScrollbar(
                        scrollBarElementRef,
                        {
                            suppressScrollX,
                            suppressScrollY
                        }
                    )
                );
            } catch (e) {
                console.error('error setting perfect scrollbar', e);
            }
        }
    }, [scrollBarElementRef, suppressScrollX, suppressScrollY]);

    return setScrollBarElementRef;
}
