import React from 'react';
import hiddenIf from '../../components/hidden-if/hidden-if';
import {Element} from 'nav-frontend-typografi';
import {useStatusTallSelector} from '../../hooks/redux/use-statustall';
import './arbeidsliste.less';
import {ReactComponent as ArbeidslisteikonBla} from '../../components/ikoner/arbeidsliste/arbeidslisteikon_bla.svg';
import {ReactComponent as ArbeidslisteikonGronn} from '../../components/ikoner/arbeidsliste/arbeidslisteikon_gronn.svg';
import {ReactComponent as ArbeidslisteikonLilla} from '../../components/ikoner/arbeidsliste/arbeidslisteikon_lilla.svg';
import {ReactComponent as ArbeidslisteikonGul} from '../../components/ikoner/arbeidsliste/arbeidslisteikon_gul.svg';
import {KategoriModell} from '../../model-interfaces';
import {BarInputRadio} from '../../components/barinput/barinput-radio';
import BarInputCheckbox from '../../components/barinput/barinput-checkbox';

export interface FilterStatusMinArbeidslisteProps {
    ferdigfilterListe: string[];
    handleChange: (e: any) => void;
    handleChangeCheckbox: (e: any) => void;
    filtervalg: any;
    endreFiltervalg: (filterId: string, filterVerdi: any) => void;
    checked: boolean;
}

function FilterStatusMinArbeidsliste(props: FilterStatusMinArbeidslisteProps) {
    const statusTall = useStatusTallSelector();

    return (
        <>
            <div className="minArbeidsliste__tittel typo-element">
                <Element className="blokk-xxs">Arbeidsliste</Element>
            </div>
            <BarInputRadio
                filterNavn="minArbeidsliste"
                handleChange={props.handleChange}
                antall={statusTall.minArbeidsliste}
                checked={props.checked}
            />
            {props.checked && (
                <div className="minArbeidsliste__kategori-checkboxwrapper">
                    <BarInputCheckbox
                        labelTekst={
                            <>
                                <ArbeidslisteikonBla />
                                <span className="arbeidslistetekst" title="Arbeidslistekategori blå">
                                    Blå
                                </span>
                            </>
                        }
                        filterNavn="minArbeidslisteBla"
                        handleChange={props.handleChangeCheckbox}
                        checked={props.checked && props.ferdigfilterListe.includes(KategoriModell.BLA)}
                        antall={statusTall.minArbeidslisteBla}
                    />
                    <BarInputCheckbox
                        labelTekst={
                            <>
                                <ArbeidslisteikonGronn />
                                <span className="arbeidslistetekst" title="Arbeidslistekategori grønn">
                                    Grønn
                                </span>
                            </>
                        }
                        filterNavn="minArbeidslisteGronn"
                        handleChange={props.handleChangeCheckbox}
                        checked={props.checked && props.ferdigfilterListe.includes(KategoriModell.GRONN)}
                        antall={statusTall.minArbeidslisteGronn}
                    />
                    <BarInputCheckbox
                        labelTekst={
                            <>
                                <ArbeidslisteikonLilla />
                                <span className="arbeidslistetekst" title="Arbeidslistekategori lilla">
                                    Lilla
                                </span>
                            </>
                        }
                        filterNavn="minArbeidslisteLilla"
                        handleChange={props.handleChangeCheckbox}
                        checked={props.checked && props.ferdigfilterListe.includes(KategoriModell.LILLA)}
                        antall={statusTall.minArbeidslisteLilla}
                    />
                    <BarInputCheckbox
                        labelTekst={
                            <>
                                <ArbeidslisteikonGul />
                                <span className="arbeidslistetekst" title="Arbeidslistekategori gul">
                                    Gul
                                </span>
                            </>
                        }
                        filterNavn="minArbeidslisteGul"
                        handleChange={props.handleChangeCheckbox}
                        checked={props.checked && props.ferdigfilterListe.includes(KategoriModell.GUL)}
                        antall={statusTall.minArbeidslisteGul}
                    />
                </div>
            )}
        </>
    );
}

export default hiddenIf(FilterStatusMinArbeidsliste);
