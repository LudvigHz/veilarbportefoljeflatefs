import * as React from 'react';
import {Normaltekst, Undertittel} from 'nav-frontend-typografi';
import {VarselModal, VarselModalType} from './varselmodal/varselmodal';
import {Fnr, FnrList} from '../fnr-list';
import './feilmelding-brukere.less';
import {Button} from '@navikt/ds-react';

interface FeilmeldingBrukereModalProps {
    isOpen: boolean;
    fnrFeil: Fnr[];
    onClose: () => void;
    tittelTekst: string;
    infotekstTekst: string;
    merInfoTekst?: string;
}

function FeilmeldingBrukereModal(props: FeilmeldingBrukereModalProps) {
    return (
        <VarselModal
            contentLabel="Modal tildeling feilet"
            isOpen={props.isOpen}
            onRequestClose={props.onClose}
            closeButton={false}
            type={VarselModalType.FEIL}
            portalClassName="arbeidsliste-modal"
            className="arbeidsliste-modal__content"
        >
            <Undertittel tag="h1" className="blokk-xxs">
                {props.tittelTekst}
            </Undertittel>
            <Normaltekst className="blokk-s">{props.infotekstTekst}</Normaltekst>
            <FnrList listeMedFnr={props.fnrFeil} />
            <Button onClick={props.onClose}>Ok</Button>
        </VarselModal>
    );
}

export default FeilmeldingBrukereModal;
