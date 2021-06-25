import * as React from 'react';
import SorteringHeader from '../components/tabell_v1/sortering-header';
import TittelValg from '../utils/utils';
import {BrukerModell, FiltervalgModell, Sorteringsfelt, Sorteringsrekkefolge} from '../model-interfaces';
import {AktiviteterValg} from '../ducks/filtrering';
import {
    I_AVTALT_AKTIVITET,
    MIN_ARBEIDSLISTE,
    MOTER_IDAG,
    UNDER_VURDERING,
    UTLOPTE_AKTIVITETER,
    VENTER_PA_SVAR_FRA_BRUKER,
    VENTER_PA_SVAR_FRA_NAV,
    ytelseAapSortering,
    ytelseUtlopsSortering
} from '../filtrering/filter-konstanter';
import {Kolonne, OversiktType} from '../ducks/ui/listevisning';
import Header from '../components/tabell_v1/header';
import VelgalleCheckboks from '../components/toolbar/velgalle-checkboks';
import './minoversikt.less';
import {ReactComponent as ArbeidslisteikonBla} from '../components/ikoner/arbeidsliste/arbeidslisteikon_bla.svg';
import {OrNothing} from '../utils/types/types';

function harValgteAktiviteter(aktiviteter) {
    if (aktiviteter && Object.keys(aktiviteter).length > 0) {
        const valgteAktiviteter = Object.values(aktiviteter).filter(
            aktivitetvalg => aktivitetvalg !== AktiviteterValg.NA
        );
        return valgteAktiviteter?.length > 0;
    }
    return false;
}

interface MinOversiktListehodeProps {
    sorteringsrekkefolge: OrNothing<Sorteringsrekkefolge>;
    sorteringOnClick: (sortering: string) => void;
    sorteringsfelt: OrNothing<Sorteringsfelt>;
    filtervalg: FiltervalgModell;
    brukere: BrukerModell[];
    valgteKolonner: Kolonne[];
    oversiktType: OversiktType;
}

function MinoversiktTableHeader({
    sorteringsrekkefolge,
    sorteringOnClick,
    filtervalg,
    sorteringsfelt,
    valgteKolonner,
    oversiktType
}: MinOversiktListehodeProps) {
    const {ytelse} = filtervalg;
    const erAapYtelse = Object.keys(ytelseAapSortering).includes(ytelse!);
    const aapRettighetsperiode = erAapYtelse ? ytelseAapSortering[ytelse!].rettighetsperiode : '';
    const ytelseUtlopsdatoNavn = erAapYtelse
        ? ytelseAapSortering[ytelse!].vedtaksperiode
        : ytelseUtlopsSortering[ytelse!];
    const ytelseSorteringHeader =
        ytelseUtlopsdatoNavn === 'utlopsdato' || erAapYtelse ? 'Gjenstående uker vedtak' : 'Gjenstående uker rettighet';
    const ferdigfilterListe = !!filtervalg ? filtervalg.ferdigfilterListe : '';
    const iAvtaltAktivitet =
        !!ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) && valgteKolonner.includes(Kolonne.AVTALT_AKTIVITET);

    const avansertAktivitet = iAvtaltAktivitet
        ? false
        : harValgteAktiviteter(filtervalg.aktiviteter) && valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET);

    const forenkletAktivitet =
        harValgteAktiviteter(filtervalg.aktiviteterForenklet) && valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET);

    return (
        <div role="row" className="brukerliste__header brukerliste__sorteringheader typo-undertekst">
            <div role="cell" className="brukerliste__gutter-left" />
            <div className="brukerliste__innhold" data-testid="brukerliste_innhold">
                <VelgalleCheckboks
                    role="cell"
                    skalVises={oversiktType in OversiktType}
                    className="velgalle-checkboks col col-xs-2"
                />
                <SorteringHeader
                    role="cell"
                    className="arbeidslistekategori__sorteringsheader"
                    sortering={Sorteringsfelt.ARBEIDSLISTEKATEGORI}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ARBEIDSLISTEKATEGORI}
                    tekst={<ArbeidslisteikonBla />}
                    title="Sorter på farge"
                    headerId="arbeidslistekategori"
                />
                <SorteringHeader
                    role="cell"
                    className="col col-xs-2"
                    sortering={Sorteringsfelt.ETTERNAVN}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ETTERNAVN}
                    tekst="Etternavn"
                    title="Etternavn"
                    headerId="etternavn"
                />
                <SorteringHeader
                    role="cell"
                    className="col col-xs-2"
                    sortering={Sorteringsfelt.FODSELSNUMMER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.FODSELSNUMMER}
                    tekst="Fødselsnr."
                    title="Fødselsnummer"
                    headerId="fnr"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.OPPFOLGINGSTARTET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.OPPFOLGINGSTARTET}
                    tekst="Oppfølging startet"
                    className="col col-xs-2"
                    skalVises={valgteKolonner.includes(Kolonne.OPPFOLGINGSTARTET)}
                    title="Startdato for pågående oppfølgingsperiode"
                    headerId="oppfolgingstartet"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.ARBEIDSLISTE_FRIST}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ARBEIDSLISTE_FRIST}
                    tekst="Arbeidsliste frist"
                    skalVises={
                        !!ferdigfilterListe?.includes(MIN_ARBEIDSLISTE) &&
                        valgteKolonner.includes(Kolonne.ARBEIDSLISTE_FRIST)
                    }
                    className="col col-xs-2"
                    title="Fristdato som er satt i arbeidslisten"
                    headerId="arbeidsliste-frist"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.ARBEIDSLISTE_OVERSKRIFT}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ARBEIDSLISTE_OVERSKRIFT}
                    tekst="Arbeidsliste tittel"
                    skalVises={
                        !!ferdigfilterListe?.includes(MIN_ARBEIDSLISTE) &&
                        valgteKolonner.includes(Kolonne.ARBEIDSLISTE_OVERSKRIFT)
                    }
                    className="col col-xs-2"
                    title="Tittel som er skrevet i arbeidslisten"
                    headerId="arbeidsliste-overskrift"
                />
                <SorteringHeader
                    role="cell"
                    sortering={ytelseUtlopsdatoNavn}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === ytelseUtlopsdatoNavn}
                    tekst={ytelseSorteringHeader}
                    skalVises={!!ytelse && valgteKolonner.includes(Kolonne.UTLOP_YTELSE)}
                    className="col col-xs-2"
                    title={TittelValg(ytelseSorteringHeader)}
                    headerId="ytelse-utlopsdato"
                />
                <SorteringHeader
                    role="cell"
                    sortering={ytelseUtlopsdatoNavn}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={ytelseUtlopsdatoNavn === sorteringsfelt}
                    tekst="Gjenstående uker vedtak"
                    skalVises={!!filtervalg.ytelse && erAapYtelse && valgteKolonner.includes(Kolonne.VEDTAKSPERIODE)}
                    className="col col-xs-2"
                    title="Gjenstående uker på gjeldende vedtak"
                    headerId="ytelse-utlopsdato-navn"
                />
                <SorteringHeader
                    role="cell"
                    sortering={aapRettighetsperiode}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === aapRettighetsperiode}
                    tekst="Gjenstående uker rettighet"
                    skalVises={!!ytelse && erAapYtelse && valgteKolonner.includes(Kolonne.RETTIGHETSPERIODE)}
                    className="col col-xs-2"
                    title="Gjenstående uker av rettighetsperioden for ytelsen"
                    headerId="rettighetsperiode-gjenstaende"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.VENTER_PA_SVAR_FRA_NAV}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VENTER_PA_SVAR_FRA_NAV}
                    tekst="Dato på melding"
                    skalVises={!!ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_NAV)}
                    className="col col-xs-2"
                    title='Dato på meldingen som er merket "Venter på svar fra NAV"'
                    headerId="venter-pa-svar-fra-nav"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.VENTER_PA_SVAR_FRA_BRUKER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VENTER_PA_SVAR_FRA_BRUKER}
                    tekst="Dato på melding"
                    skalVises={!!ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_BRUKER)}
                    className="col col-xs-2"
                    title='Dato på meldingen som er merket "Venter på svar fra bruker"'
                    headerId="venter-pa-svar-fra-bruker"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.UTLOPTE_AKTIVITETER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.UTLOPTE_AKTIVITETER}
                    tekst="Utløpsdato aktivitet"
                    skalVises={!!ferdigfilterListe?.includes(UTLOPTE_AKTIVITETER)}
                    className="col col-xs-2"
                    title='Utløpsdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="utlopte-aktiviteter"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.I_AVTALT_AKTIVITET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.I_AVTALT_AKTIVITET}
                    tekst="Neste utløpsdato aktivitet"
                    skalVises={iAvtaltAktivitet}
                    className="col col-xs-2"
                    title='Neste utløpsdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="i-avtalt-aktivitet"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.MOTER_IDAG}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.MOTER_IDAG}
                    tekst="Klokkeslett møte"
                    skalVises={!!ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_IDAG)}
                    className="col col-xs-2"
                    title="Tidspunktet møtet starter"
                    headerId="moter-idag"
                />
                <Header
                    role="cell"
                    skalVises={
                        !!ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_VARIGHET)
                    }
                    className="col col-xs-2"
                    title="Varighet på møtet"
                    headerId="varighet-mote"
                >
                    Varighet møte
                </Header>
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.VEDTAKSTATUS}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VEDTAKSTATUS}
                    skalVises={
                        !!ferdigfilterListe?.includes(UNDER_VURDERING) && valgteKolonner.includes(Kolonne.VEDTAKSTATUS)
                    }
                    tekst="Status § 14a-vedtak"
                    className="col col-xs-2"
                    title="Status oppfølgingvedtak"
                    headerId="vedtakstatus"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.VEDTAKSTATUS_ENDRET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VEDTAKSTATUS_ENDRET}
                    tekst="Dager siden status"
                    skalVises={
                        !!ferdigfilterListe?.includes(UNDER_VURDERING) &&
                        valgteKolonner.includes(Kolonne.VEDTAKSTATUS_ENDRET)
                    }
                    className="col col-xs-2"
                    title="Dager siden status"
                    headerId="vedtakstatus-endret"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.ANSVARLIG_VEILEDER_FOR_VEDTAK}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ANSVARLIG_VEILEDER_FOR_VEDTAK}
                    tekst="Ansvarlig for vedtak"
                    skalVises={
                        !!ferdigfilterListe?.includes(UNDER_VURDERING) &&
                        valgteKolonner.includes(Kolonne.ANSVARLIG_VEILEDER_FOR_VEDTAK)
                    }
                    className="col col-xs-2"
                    title="Ansvarlig veileder for vedtak"
                    headerId="vedtakstatus-endret"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.VALGTE_AKTIVITETER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VALGTE_AKTIVITETER}
                    tekst="Neste utløpsdato aktivitet"
                    skalVises={avansertAktivitet || forenkletAktivitet}
                    className="col col-xs-2"
                    title='Neste utløpsdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="valgte-aktiviteter"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.START_DATO_FOR_AVTALT_AKTIVITET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.START_DATO_FOR_AVTALT_AKTIVITET}
                    tekst="Startdato aktivitet"
                    skalVises={
                        !!ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) &&
                        valgteKolonner.includes(Kolonne.START_DATO_AKTIVITET)
                    }
                    className="col col-xs-2"
                    title='Startdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="start-dato-for-avtalt-aktivitet"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.NESTE_START_DATO_FOR_AVTALT_AKTIVITET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.NESTE_START_DATO_FOR_AVTALT_AKTIVITET}
                    tekst="Neste startdato aktivitet"
                    skalVises={
                        !!ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) &&
                        valgteKolonner.includes(Kolonne.NESTE_START_DATO_AKTIVITET)
                    }
                    className="col col-xs-2"
                    title='Neste startdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="neste-start-dato-for-avtalt-aktivitet"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.FORRIGE_DATO_FOR_AVTALT_AKTIVITET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.FORRIGE_DATO_FOR_AVTALT_AKTIVITET}
                    tekst="Passert startdato aktivitet"
                    skalVises={
                        !!ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) &&
                        valgteKolonner.includes(Kolonne.FORRIGE_START_DATO_AKTIVITET)
                    }
                    className="col col-xs-2"
                    title='Passert startdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="forrige-dato-for-avtalt-aktivitet"
                />
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.FORRIGE_DATO_FOR_AVTALT_AKTIVITET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.FORRIGE_DATO_FOR_AVTALT_AKTIVITET}
                    tekst="Passert startdato aktivitet"
                    skalVises={
                        !!ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) &&
                        valgteKolonner.includes(Kolonne.FORRIGE_START_DATO_AKTIVITET)
                    }
                    className="col col-xs-2"
                    title='Passert startdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="forrige-dato-for-avtalt-aktivitet"
                />
                <Header
                    role="cell"
                    skalVises={!!filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING)}
                    className="col col-xs-2"
                    title="Siste endring"
                    headerId="siste-endring"
                >
                    Siste endring
                </Header>
                <SorteringHeader
                    role="cell"
                    sortering={Sorteringsfelt.SISTE_ENDRING_DATO}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.SISTE_ENDRING_DATO}
                    tekst="Dato siste endring"
                    skalVises={!!filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING_DATO)}
                    className="col col-xs-2"
                    title="Dato siste endring"
                    headerId="dato-siste-endring"
                />
            </div>
            <div className="brukerliste__gutter-right" />
        </div>
    );
}

export default MinoversiktTableHeader;
