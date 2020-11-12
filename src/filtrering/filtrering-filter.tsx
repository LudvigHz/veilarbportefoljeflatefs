import * as React from 'react';
import {Element, Normaltekst} from 'nav-frontend-typografi';
import CheckboxFilterform from '../components/checkbox-filterform/checkbox-filterform';
import AktivitetFilterform from '../components/aktivitet-filterform/aktivitet-filterform';
import {
    aktiviteter,
    alder,
    cvJobbprofil,
    fodselsdagIMnd,
    formidlingsgruppe,
    hovedmal,
    innsatsgruppe,
    kjonn,
    manuellBrukerStatus,
    registreringstype,
    rettighetsgruppe,
    servicegruppe,
    ytelse
} from './filter-konstanter';
import OverskriftMedHjelpeTekst from '../components/overskrift-med-hjelpetekst';
import {RadioFilterform} from '../components/radio-filterform/radio-filterform';
import Dropdown from '../components/dropdown/dropdown';
import '../components/checkbox-filterform/checkbox-filterform.less';
import FodselsdatoFilterform from '../components/checkbox-filterform/fodselsdato-filterform';
import {ReactComponent as InfoIkon} from '../components/ikoner/info-ikon.svg';
import {useFeatureSelector} from '../hooks/redux/use-feature-selector';
import {GJEM_HOVEDMAL} from '../konstanter';
import './filtrering-skjema.less';
import '../components/sidebar/sidebar.less';
import {PopoverOrientering} from 'nav-frontend-popover';
import AlderFilterform from '../components/alder-filterform/alder-filterform';

interface FiltreringFilterProps {
    filtervalg: any;
    endreFiltervalg: (filterId: string, filterVerdi: any) => void;
    enhettiltak: any;
}

function FiltreringFilter({filtervalg, endreFiltervalg, enhettiltak}: FiltreringFilterProps) {
    const erGjemHovedmalFeatureTogglePa = useFeatureSelector()(GJEM_HOVEDMAL);
    return (
        <div className="filtrering-filter" data-testid="filtrering-filter_container">
            <div className="col-sm-12 blokk-xs filtrering-filter__kolonne">
                <Element className="blokk-xxs" tag="h3">
                    Demografi
                </Element>
                <Dropdown
                    name="Alder"
                    render={lukkDropdown => (
                        <AlderFilterform
                            form="alder"
                            valg={alder}
                            filtervalg={filtervalg}
                            endreFiltervalg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Fødselsdato"
                    render={lukkDropdown => (
                        <FodselsdatoFilterform
                            form="fodselsdagIMnd"
                            valg={fodselsdagIMnd()}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Kjønn"
                    render={lukkDropdown => (
                        <RadioFilterform
                            valg={kjonn}
                            endreFiltervalg={endreFiltervalg}
                            filtervalg={filtervalg}
                            closeDropdown={lukkDropdown}
                            filterId="kjonn"
                        />
                    )}
                />
            </div>
            <div className="col-sm-12 blokk-xs filtrering-filter__kolonne">
                <Element className="blokk-xxs" tag="h3">
                    Status og brukergrupper
                </Element>
                <Dropdown
                    name="CV og jobbprofil"
                    render={lukkDropdown => (
                        <RadioFilterform
                            valg={cvJobbprofil}
                            endreFiltervalg={endreFiltervalg}
                            filtervalg={filtervalg}
                            closeDropdown={lukkDropdown}
                            filterId="cvJobbprofil"
                        />
                    )}
                />
                <Dropdown
                    name="Svar fra registrering"
                    render={lukkDropdown => (
                        <>
                            <div className="registreringsfilter__infocontainer">
                                <InfoIkon className="registreringsfilter__infoikon" />
                                <Normaltekst className="registreringsfilter__infotekst">
                                    Situasjonen brukeren oppgir på registreringstidspunktet.
                                </Normaltekst>
                            </div>
                            <CheckboxFilterform
                                form="registreringstype"
                                valg={registreringstype}
                                filtervalg={filtervalg}
                                endreFilterValg={endreFiltervalg}
                                closeDropdown={lukkDropdown}
                                className="registreringstype"
                            />
                        </>
                    )}
                />
                <Dropdown
                    name="Innsatsgruppe"
                    render={lukkDropdown => (
                        <CheckboxFilterform
                            form="innsatsgruppe"
                            valg={innsatsgruppe}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Hovedmål"
                    hidden={erGjemHovedmalFeatureTogglePa}
                    render={lukkDropdown => (
                        <CheckboxFilterform
                            form="hovedmal"
                            valg={hovedmal}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Formidlingsgruppe"
                    render={lukkDropdown => (
                        <CheckboxFilterform
                            form="formidlingsgruppe"
                            valg={formidlingsgruppe}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Servicegruppe"
                    render={lukkDropdown => (
                        <CheckboxFilterform
                            form="servicegruppe"
                            valg={servicegruppe}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Manuell oppfølging"
                    render={lukkDropdown => (
                        <CheckboxFilterform
                            form="manuellBrukerStatus"
                            valg={manuellBrukerStatus}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
            </div>
            <div className="col-sm-12 blokk-xs filtrering-filter__kolonne">
                <Element className="blokk-xxs" tag="h3">
                    Rettighetsgruppe og ytelse
                </Element>
                <Dropdown
                    name="Rettighetsgruppe"
                    render={lukkDropdown => (
                        <CheckboxFilterform
                            form="rettighetsgruppe"
                            valg={rettighetsgruppe}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Ytelse"
                    render={lukkDropdown => (
                        <RadioFilterform
                            valg={ytelse}
                            endreFiltervalg={endreFiltervalg}
                            filtervalg={filtervalg}
                            closeDropdown={lukkDropdown}
                            filterId="ytelse"
                        />
                    )}
                />
            </div>
            <div className="col-sm-12 filtrering-filter__kolonne">
                <OverskriftMedHjelpeTekst
                    overskriftTekst="Aktivitet"
                    hjelpeTekst="Visning av aktiviteter og dato i liste gjelder kun avtalte aktiviteter bruker har med NAV."
                    orientering={PopoverOrientering.Hoyre}
                />
                <Dropdown
                    name="Aktivitet"
                    render={lukkDropdown => (
                        <AktivitetFilterform
                            valg={aktiviteter}
                            filtervalg={filtervalg}
                            onSubmit={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                        />
                    )}
                />
                <Dropdown
                    name="Tiltakstype"
                    disabled={!(filtervalg.aktiviteter.TILTAK === 'JA')}
                    render={lukkDropdown => (
                        <CheckboxFilterform
                            form="tiltakstyper"
                            valg={enhettiltak}
                            filtervalg={filtervalg}
                            endreFilterValg={endreFiltervalg}
                            closeDropdown={lukkDropdown}
                            emptyCheckboxFilterFormMessage="Ingen tiltak funnet"
                            className="tiltakstyper"
                        />
                    )}
                />
            </div>
        </div>
    );
}

export default FiltreringFilter;
