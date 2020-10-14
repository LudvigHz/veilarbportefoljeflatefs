import {default as React, useState} from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import {Normaltekst, Systemtittel, Undertittel} from 'nav-frontend-typografi';
import ChevronLenke, {Retning} from '../../chevron-lenke/chevron-lenke';
import Stegviser from '../../stegviser/stegviser';
import {getTour} from './tour-modal-custom/tour-modal-custom';
import './tour-modal.less';

export enum ModalName {
    MOTE_FILTER = 'TOUR_MODAL-MOTE_FILTER',
    NY_KOLONNE = 'TOUR_MODAL-NY_KOLONNE',
    VEILEDERGRUPPER = 'TOUR_MODAL-VEILEDERGRUPPER',
    TILRETTELEGGING = 'TOUR_MODAL-TILRETTELEGGING',
    VEILEDERVERKTOY = 'TOUR_MODAL-VEILEDERVERKTOY',
    PERMITTERTE = 'TOUR_MODAL-PERMITTERTE',
    MINE_FILTER = 'TOUR_MODAL-MINE_FILTER'
}

export interface Step {
    tittel: string;
    tekst: React.ReactNode;
    bilde: string;
}

interface TourModalProps {
    modalName: ModalName;
    open: boolean;
    onClose: (e: boolean) => void;
    systemtittel?: string;
}

function TourModal(props: TourModalProps) {
    const [stepIndex, setStepIndex] = useState(0);

    const lukkModal = () => {
        props.onClose(isFinalStep);
    };

    const handlePreviousBtnClicked = () => {
        setStepIndex(stepIndex - 1);
    };

    const handleNextBtnClicked = () => {
        setStepIndex(stepIndex + 1);
    };

    const steps = getTour(props.modalName);
    if (!steps) return null;
    const step = steps[stepIndex];
    const isFinalStep = stepIndex === steps.length - 1;

    const hidePrevBtn = stepIndex === 0;
    const nextBtnText = isFinalStep ? 'Ferdig' : 'Neste';
    const nextBtnHandleClick = isFinalStep ? lukkModal : handleNextBtnClicked;
    const systemtittel = (props.systemtittel === '' || props.systemtittel === undefined) ? 'Ny oppdatering' : props.systemtittel;

    return (
        <NavFrontendModal
            className="tour-modal"
            contentLabel="TourModal"
            isOpen={props.open}
            closeButton
            shouldCloseOnOverlayClick
            onRequestClose={lukkModal}
        >
            <div className="tour-modal__header--wrapper"
                 data-testid='endringslogg_tour-modal'>
                <header className="tour-modal__header">
                    <Systemtittel>{systemtittel}</Systemtittel>
                </header>
            </div>
            <main className="tour-modal__main">
                <div className="tour-modal__main--bilde-wrapper">
                    <img
                        alt="Bilde på endringen"
                        src={step.bilde}
                        className="tour-modal__main--bilde"
                    />
                </div>
                <div className="tour-modal__main--beskrivelse">
                    <Undertittel className="blokk-xxxs">{step.tittel}</Undertittel>
                    <Normaltekst className="tour-modal__main--tekst">{step.tekst}</Normaltekst>
                </div>
            </main>
            <footer className="tour-modal__footer">
                <ChevronLenke retning={Retning.VENSTRE}
                              tekst="Forrige"
                              hide={hidePrevBtn}
                              onClick={handlePreviousBtnClicked}
                              dataTestId='endringslogg_forrige-knapp'/>
                <Stegviser antallSteg={steps.length}
                           valgtSteg={stepIndex}/>
                <ChevronLenke retning={Retning.HOYRE}
                              tekst={nextBtnText}
                              onClick={nextBtnHandleClick}
                              dataTestId={isFinalStep ? 'endringslogg_ferdig-knapp' : 'endringslogg_neste-knapp'}/>
            </footer>
        </NavFrontendModal>
    );
}

export default TourModal;
