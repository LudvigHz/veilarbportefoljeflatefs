import * as React from 'react';
import classNames from 'classnames/dedupe';
import {Hovedknapp} from 'nav-frontend-knapper';
import {Textarea} from 'nav-frontend-skjema';
import {Innholdstittel, Normaltekst} from 'nav-frontend-typografi';
import TilfredshetValg from './tilfredshet-valg';
import './tilbakemelding-modal.less';
import {useState} from 'react';
import TilbakemeldingTakkModal from './tilbakemelding-takk-modal';

export interface Tilbakemelding {
    tilfredshet: number;
    kommentar: string;
}

interface TilbakemeldingModalProps {
    open: boolean;
    onTilbakemeldingSendt: (tilbakemelding: Tilbakemelding) => void;
    onIkkeVisIgjen: () => void;
}

function TilbakemeldingModal({open, onTilbakemeldingSendt, onIkkeVisIgjen}: TilbakemeldingModalProps) {
    const KOMMENTAR_ROWS = 5;
    const KOMMENTAR_MAX_CHAR = 750;

    const [tilfredshet, setTilfredshet] = useState(0);
    const [kommentar, setKommentar] = useState('');
    const [harSendt, setHarSendt] = useState(false);
    const [harBlittVist, setHarBlittVist] = useState(false);
    const ikkeVisIgjen = false;

    const handleKommentarChanged = e => {
        const value = e.target.value;

        if (value.length <= KOMMENTAR_MAX_CHAR) {
            setKommentar(value);
        }
    };

    const handleFormSubmitted = () => {
        setHarSendt(true);
        onTilbakemeldingSendt({tilfredshet, kommentar});
    };

    const handleTilfredshetChanged = (tilfredshet: number) => {
        setTilfredshet(tilfredshet);
    };

    const harBesvartTilfredshet = tilfredshet > 0;
    const visFritekst = true;

    if (open && !harBlittVist) {
        setHarBlittVist(true);
    }

    // Make sure that the animation will trigger when closing instead of returning null (no animation)
    if ((!open && !harBlittVist) || ikkeVisIgjen) {
        return null;
    }

    return (
        <div
            className={classNames(
                'tilbakemelding-modal',
                {'tilbakemelding-modal--slide-in': open},
                {'tilbakemelding-modal--slide-out': !open}
            )}
        >
            <div
                className={classNames('tilbakemelding-modal__innhold', {
                    'tilbakemelding-modal__innhold--takk': harSendt
                })}
                data-testid={harSendt ? 'tilbakemelding_modal_takk' : 'tilbakemelding_modal'}
            >
                {harSendt ? (
                    <TilbakemeldingTakkModal />
                ) : (
                    <>
                        <Innholdstittel className="blokk-xxs tilbakemelding-modal__tittel">
                            Den digitale dialogen
                        </Innholdstittel>
                        <Normaltekst className="tilbakemelding-modal__ingress">
                            Vi gjør en kartlegging av dialogen. Hvor fornøyd er du med den digitale dialogen? Svarene er
                            anonyme.
                        </Normaltekst>
                        <div className="tilbakemelding-modal__tilfredshet">
                            <TilfredshetValg
                                className="blokk-xs"
                                onTilfredshetChanged={handleTilfredshetChanged}
                                defaultTilfredshet={tilfredshet}
                            />
                        </div>
                        {harBesvartTilfredshet && (
                            <form className="tilbakemelding-modal__ekspander" onSubmit={handleFormSubmitted}>
                                {visFritekst && (
                                    <div className="tilbakemelding-modal__kommentar">
                                        <Textarea
                                            className="tilbakemelding-modal__kommentar-felt"
                                            label="Fortell gjerne litt mer om hvorfor."
                                            rows={KOMMENTAR_ROWS}
                                            maxLength={KOMMENTAR_MAX_CHAR}
                                            value={kommentar}
                                            onChange={handleKommentarChanged}
                                            data-testid="tilfredshet_kommentarfelt"
                                        />
                                    </div>
                                )}
                                <Hovedknapp role="submit" className="knapp--hoved" data-testid="tilfredshet_send-knapp">
                                    Send
                                </Hovedknapp>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default TilbakemeldingModal;
