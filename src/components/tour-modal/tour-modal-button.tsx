import { default as React, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { default as TourModal, ModalName } from '../tour-modal/tour-modal';
import { Knapp } from 'nav-frontend-knapper';
import { logEvent } from '../../utils/frontend-logger';

interface ModalStepperProps {
    modal: ModalName;
    loggApen?: boolean;
}

export default function TourModalButton(props: ModalStepperProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Knapp className="endringslogg-stepperKnapp" mini={true} onClick={() => {
                setOpen(true);
                logEvent('portefolje.endringslogg_modal');
            }}>
                Se hvordan
            </Knapp>
            <TourModal
                open={open}
                modalName={props.modal}
                onClose={()=>setOpen(false)}
            />
        </>
    );
}
