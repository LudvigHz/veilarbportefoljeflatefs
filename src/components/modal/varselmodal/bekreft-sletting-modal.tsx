import React from 'react';
import {VarselModal, VarselModalType} from './varselmodal';
import {BodyShort, Button, Heading} from '@navikt/ds-react';
import {Delete} from '@navikt/ds-icons';
import './varsel-modal.css';

interface BekreftSlettingModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: () => void;
    tittel: string;
    infoTekst?: string;
    navn: string;
}

function BekreftSlettingModal({isOpen, onRequestClose, onSubmit, tittel, infoTekst, navn}: BekreftSlettingModalProps) {
    const slettKnapp = () => {
        onSubmit();
        onRequestClose();
    };

    return (
        <VarselModal
            isOpen={isOpen}
            onClose={onRequestClose}
            className="bekreft-sletting-modal"
            type={VarselModalType.ADVARSEL}
        >
            <div className="bekreft-sletting-modal__tekstgruppe">
                <Heading size="large" level="1">
                    {tittel}
                </Heading>
                {infoTekst && <BodyShort size="small">{infoTekst}</BodyShort>}
                <BodyShort size="small">
                    Er du sikker på at du vil slette <b>{navn}</b>?
                </BodyShort>
            </div>
            <div className="bekreft-sletting-modal__knappegruppe">
                <Button
                    size="small"
                    variant="danger"
                    type="submit"
                    onClick={slettKnapp}
                    icon={<Delete />}
                    data-testid="bekreft-sletting_modal_slett-knapp"
                >
                    Slett
                </Button>
                <Button size="small" variant="secondary" type="button" onClick={onRequestClose}>
                    Avbryt
                </Button>
            </div>
        </VarselModal>
    );
}

export default BekreftSlettingModal;
