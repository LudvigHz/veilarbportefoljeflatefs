import * as React from 'react';
import {useState} from 'react';
import {VarselModal, VarselModalType} from './varselmodal/varselmodal';
import './feilmelding-brukere.css';
import {BodyShort, Button, Heading} from '@navikt/ds-react';

interface FilterFeilModalProps {
    isOpen: boolean;
}

export default function FilterFeilModal({isOpen}: FilterFeilModalProps) {
    const [erAapen, setErAapen] = useState(isOpen);

    const lukkModal = () => {
        setErAapen(false);
    };

    return (
        <VarselModal
            isOpen={erAapen}
            type={VarselModalType.FEIL}
            onClose={lukkModal}
            portalClassName="filter-feil-modal"
            className="filter-feil-modal__content"
        >
            <Heading size="small" level="1">
                Det oppstod en teknisk feil.
            </Heading>
            <BodyShort size="small">
                Det oppstod et problem med ett eller flere filter.
                <br />
                Prøv igjen senere.
            </BodyShort>
            <Button size="small" onClick={lukkModal}>
                Ok
            </Button>
        </VarselModal>
    );
}
