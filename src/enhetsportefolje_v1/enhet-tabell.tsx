import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import EnhetTabellRow from './enhet-tabell-body';
import {settBrukerSomMarkert} from '../ducks/portefolje';
import {usePortefoljeSelector} from '../hooks/redux/use-portefolje-selector';
import {Kolonne, OversiktType} from '../ducks/ui/listevisning';
import {useForrigeBruker} from '../hooks/portefolje/use-forrige-bruker';
import './enhetsportefolje.less';
import './brukerliste.less';
import Innholdslaster from '../innholdslaster/innholdslaster';
import {AppState} from '../reducer';
import {STATUS} from '../ducks/utils';
import {
    I_AVTALT_AKTIVITET, MOTER_IDAG, UNDER_VURDERING,
    UTLOPTE_AKTIVITETER,
    VENTER_PA_SVAR_FRA_BRUKER,
    VENTER_PA_SVAR_FRA_NAV,
    ytelseAapSortering,
    ytelsevalg
} from "../filtrering/filter-konstanter";
import EnhetTabellHeader from "./enhet-tabell-header";
import {useSetPortefoljeSortering} from "../hooks/portefolje/use-sett-sortering";

const finnBrukersVeileder = (veiledere, bruker) => veiledere.find(veileder => veileder.ident === bruker.veilederId);

interface EnhetTabellProps {
    classNameWrapper: string;
}

export interface VisKolonne {
    veilederNavn: boolean;
    veilederIdent: boolean;
    rettighetsperiodeTilDagpenger: boolean;
    rettighetsperiodeTilDagpengerMedPermittering: boolean;
    vedtaksPeriodeTilAAP: boolean;
    rettighetsPeriodeTilAAP: boolean;
    rettighetsperiodeTilTiltakPenger: boolean;
    datoTilVenterPaSvarFraBruker: boolean;
    datoTilVenterPaSvarFraNav: boolean;
    datoTilUtlopteAktiviteter: boolean;
    iAvtaltAktivitet: boolean;
    moteKlokkeslett: boolean;
    moteVarighet: boolean;
    vedtakStatus: boolean;
    vedtakStatusEndret: boolean;
    ansvarligVeilderForVedtak: boolean;
    sisteEndring: boolean;
    sisteEndringTidsfunkt: boolean;
}

function EnhetTabell(props: EnhetTabellProps) {
    const forrigeBruker = useForrigeBruker();
    const {brukere, filtervalg, enhetId, listevisning, portefolje, sorteringsrekkefolge, sorteringsfelt} = usePortefoljeSelector(
        OversiktType.enhetensOversikt
    );
    const veiledere = useSelector((state: AppState) => state.veiledere);
    const dispatch = useDispatch();
    const settMarkert = (fnr, markert) => dispatch(settBrukerSomMarkert(fnr, markert));
    const tilordningerStatus = portefolje.tilordningerstatus !== STATUS.RELOADING ? STATUS.OK : STATUS.RELOADING;
    const ferdigfilterListe = !!filtervalg ? filtervalg.ferdigfilterListe : '';
    const {ytelse} = filtervalg;
    const ytelsevalgIntl = ytelsevalg();
    const valgteKolonner = listevisning.valgte;
    const erAapYtelse = !!ytelse && Object.keys(ytelseAapSortering).includes(ytelse);
    const ytelseAapVedtaksperiodeSkalVises = valgteKolonner.includes(Kolonne.VEDTAKSPERIODE);
    const ytelseAapRettighetsperiodeSkalVises = valgteKolonner.includes(Kolonne.RETTIGHETSPERIODE);
    const erYtelseFilterValgt = valgteKolonner.includes(Kolonne.UTLOP_YTELSE);
    const erDagpengerUtenPermitteringYtelse: boolean = (
        ytelse === ytelsevalgIntl.DAGPENGER || ytelse === ytelsevalgIntl.ORDINARE_DAGPENGER ||
        ytelse === ytelsevalgIntl.DAGPENGER_MED_PERMITTERING_FISKEINDUSTRI ||
        ytelse === ytelsevalgIntl.LONNSGARANTIMIDLER_DAGPENGER);
    const erDagPengerMedPermitteringYtelse: boolean = (ytelse === ytelsevalgIntl.DAGPENGER_MED_PERMITTERING);
    const erTiltakpengerYtelse: boolean = (ytelse === ytelsevalgIntl.TILTAKSPENGER);
    const settSorteringOgHentPortefolje = useSetPortefoljeSortering(OversiktType.enhetensOversikt);

    const visKolonner = (): VisKolonne => ({
        veilederNavn: valgteKolonner.includes(Kolonne.VEILEDER),
        veilederIdent: valgteKolonner.includes(Kolonne.NAVIDENT),
        rettighetsperiodeTilDagpenger: (erYtelseFilterValgt && erDagpengerUtenPermitteringYtelse),
        rettighetsperiodeTilDagpengerMedPermittering: (erYtelseFilterValgt && erDagPengerMedPermitteringYtelse),
        vedtaksPeriodeTilAAP: (ytelseAapVedtaksperiodeSkalVises && erAapYtelse),
        rettighetsPeriodeTilAAP: (ytelseAapRettighetsperiodeSkalVises && erAapYtelse),
        rettighetsperiodeTilTiltakPenger: (erYtelseFilterValgt && erTiltakpengerYtelse),
        datoTilVenterPaSvarFraBruker: (ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_BRUKER) && valgteKolonner.includes(Kolonne.VENTER_SVAR)),
        datoTilVenterPaSvarFraNav: (ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_NAV) && valgteKolonner.includes(Kolonne.VENTER_SVAR)),
        datoTilUtlopteAktiviteter: (ferdigfilterListe?.includes(UTLOPTE_AKTIVITETER) && valgteKolonner.includes(Kolonne.UTLOPTE_AKTIVITETER)),
        iAvtaltAktivitet: (ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) && valgteKolonner.includes(Kolonne.AVTALT_AKTIVITET)),
        moteKlokkeslett: (ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_IDAG)),
        moteVarighet: (ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_VARIGHET)),
        vedtakStatus: (ferdigfilterListe?.includes(UNDER_VURDERING) && valgteKolonner.includes(Kolonne.VEDTAKSTATUS)),
        vedtakStatusEndret: (ferdigfilterListe?.includes(UNDER_VURDERING) && valgteKolonner.includes(Kolonne.VEDTAKSTATUS_ENDRET)),
        ansvarligVeilderForVedtak: (ferdigfilterListe?.includes(UNDER_VURDERING) && valgteKolonner.includes(Kolonne.ANSVARLIG_VEILEDER_FOR_VEDTAK)),
        sisteEndring: (filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING)),
        sisteEndringTidsfunkt: (filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING_DATO))
    });

    return (
        <Innholdslaster avhengigheter={[portefolje, veiledere, {status: tilordningerStatus}]}>
            <div role="table" className={props.classNameWrapper}>
                <div role="rowgroup">
                    <EnhetTabellHeader
                    sorteringsrekkefolge={sorteringsrekkefolge}
                    sorteringOnClick={settSorteringOgHentPortefolje}
                    filtervalg={filtervalg}
                    sorteringsfelt={sorteringsfelt}
                    valgteKolonner={valgteKolonner}
                    oversiktType={OversiktType.enhetensOversikt}
                />
                </div>
                <div role="rowgroup" className="blokk-xs enhet-tabell brukerliste">
                    {brukere.map(bruker => (
                        <EnhetTabellRow
                            key={bruker.fnr || bruker.guid}
                            bruker={bruker}
                            enhetId={enhetId}
                            settMarkert={settMarkert}
                            filtervalg={filtervalg}
                            valgteKolonner={valgteKolonner}
                            brukersVeileder={finnBrukersVeileder(veiledere.data.veilederListe, bruker)}
                            forrigeBruker={forrigeBruker}
                            SkalViseKolonne={visKolonner}
                        />
                    ))}
                </div>
            </div>
        </Innholdslaster>
    );
}

export default EnhetTabell;
