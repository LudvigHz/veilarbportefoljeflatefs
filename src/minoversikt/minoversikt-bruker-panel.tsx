import * as React from 'react';
import {MouseEvent, useState} from 'react';
import classNames from 'classnames';
import ArbeidslisteButton from '../components/tabell/arbeidslistebutton';
import Arbeidslistekategori from '../components/tabell/arbeidslisteikon';
import Etiketter from '../components/tabell/etiketter';
import {BrukerModell, FiltervalgModell, VeilederModell} from '../model-interfaces';
import Collapse from 'react-collapse';
import MinOversiktKolonner from './minoversikt-kolonner';
import ArbeidslistePanel from './minoversikt-arbeidslistepanel';
import {Kolonne} from '../ducks/ui/listevisning';
import {useLayoutEffect} from 'react';
import {OrNothing} from '../utils/types/types';
import './minoversikt.less';
import {Checkbox} from 'nav-frontend-skjema';
import {useFeatureSelector} from '../hooks/redux/use-feature-selector';
import {VEDTAKSTOTTE} from '../konstanter';
import {logEvent} from '../utils/frontend-logger';
import {Info} from "../components/tabell/etikett";

interface MinOversiktBrukerPanelProps {
    bruker: BrukerModell;
    settMarkert: (fnr: string, markert: boolean) => void;
    enhetId: OrNothing<string>;
    filtervalg: FiltervalgModell;
    innloggetVeileder: OrNothing<VeilederModell>;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    valgteKolonner: Kolonne[];
    varForrigeBruker?: boolean;
    radId?: number;
}

function MinoversiktBrukerPanel(props: MinOversiktBrukerPanelProps) {
    const [apen, setOpen] = useState<boolean>(false);
    const erVedtaksStotteFeatureTogglePa = useFeatureSelector()(VEDTAKSTOTTE);
    const scrollToLastPos = () => {
        const xPos = parseInt(localStorage.getItem('xPos') || '0');
        const yPos = parseInt(localStorage.getItem('yPos') || '0');
        window.scrollTo(xPos, yPos);
    };

    useLayoutEffect(() => {
        if (props.varForrigeBruker) {
            scrollToLastPos();
        }
    }, [props.varForrigeBruker]);

    function handleArbeidslisteButtonClick(event) {
        event.preventDefault();
        setOpen(!apen);
        logEvent('portefolje.metrikker.ekspander-arbeidsliste', {apen: !apen});
        if (props.onClick) {
            props.onClick(event);
        }
    }

    const {bruker, enhetId, filtervalg, valgteKolonner, innloggetVeileder, settMarkert, varForrigeBruker, radId} = props;
    const arbeidslisteAktiv = bruker.arbeidsliste.arbeidslisteAktiv;
    const classname = classNames({
        'brukerliste--forrigeBruker': varForrigeBruker,
    });

    return (
        <li className={classname}>
            <div className="brukerliste__element">
                <div className="brukerliste__gutter-left brukerliste--min-width-minside">
                    <Checkbox
                        checked={bruker.markert}
                        disabled={bruker.fnr === ''}
                        onChange={() => settMarkert(bruker.fnr, !bruker.markert)}
                        label=""
                        className="brukerliste__checkbox"
                        data-testid={`brukerliste-checkbox_min-oversikt_${radId}`}
                    />
                    <Arbeidslistekategori skalVises={arbeidslisteAktiv} kategori={bruker.arbeidsliste.kategori}/>
                </div>
                <MinOversiktKolonner
                    className="brukerliste__innhold flex flex--center"
                    bruker={bruker}
                    filtervalg={filtervalg}
                    valgteKolonner={valgteKolonner}
                    enhetId={enhetId}
                />
                <div className="brukerliste__gutter-right">
                    <div className="brukerliste__etiketter">
                        <Etiketter bruker={bruker} erVedtakStotteFeatureTogglePa={erVedtaksStotteFeatureTogglePa}/>
                        <Info hidden={!bruker.nyForVeileder} typo="undertekst">
                            Ny bruker
                        </Info>
                    </div>
                    <ArbeidslisteButton
                        skalVises={arbeidslisteAktiv}
                        apen={apen}
                        onClick={handleArbeidslisteButtonClick}
                    />
                </div>
            </div>
            <Collapse isOpened={apen}>
                <ArbeidslistePanel
                    skalVises={arbeidslisteAktiv}
                    bruker={bruker}
                    innloggetVeileder={innloggetVeileder && innloggetVeileder.ident}
                    settMarkert={() => settMarkert(bruker.fnr, !bruker.markert)}
                />
            </Collapse>
        </li>
    );
}

export default MinoversiktBrukerPanel;
