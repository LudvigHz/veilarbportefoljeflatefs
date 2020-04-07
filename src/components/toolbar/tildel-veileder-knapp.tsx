import * as React from 'react';
import { useSelector } from 'react-redux';
import { VIS_TILDEL_VEILEDER_MODAL } from '../../ducks/modal';
import './toolbar.less';
import { AppState } from '../../reducer';
import { ReactComponent as TildelVeilederIkon } from '../ikoner/person-add-1.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import TildelVeilederModal from '../modal/tildel-veileder/tildel-veileder-modal';

interface LeggTilArbeidslisteProps {

    onClickHandler: () => void;
    skalVises: boolean;
    filtergruppe?: string;
    gjeldendeVeileder?: string;
}

function TildelVeilederKnapp(props: LeggTilArbeidslisteProps) {
    const modalSkalVises = useSelector((state: AppState) => state.modal.modal) === VIS_TILDEL_VEILEDER_MODAL;
    const brukere = useSelector((state: AppState) => state.portefolje.data.brukere);

    if (!props.skalVises) {
        return null;
    }

    const valgteBrukere = brukere.filter((bruker) => bruker.markert === true);
    const aktiv = valgteBrukere.length > 0;

    return (
        <div className="toolbar_btnwrapper">
            <button
                type="button"
                className='toolbar_btn'
                disabled={!aktiv}
                onClick={props.onClickHandler}
            >
                <TildelVeilederIkon className="toolbar-knapp__ikon" id="tildel-veileder-ikon"/>
                <Normaltekst className="toolbar-knapp__tekst">Tildel veileder</Normaltekst>
            </button>
            {modalSkalVises && <TildelVeilederModal isOpen={modalSkalVises} valgteBrukere={valgteBrukere}/>}
        </div>
    );
}

export default TildelVeilederKnapp;
