import { default as React, useEffect, useState } from 'react';
import Ekspanderbartpanel, { EkspanderbartpanelBase, EkspanderbartpanelProps } from 'nav-frontend-ekspanderbartpanel';
import './endringslogg.less';
import { Innholdstittel, Element, Normaltekst, EtikettLiten } from 'nav-frontend-typografi';
import classNames from 'classnames/dedupe';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UnmountClosed, Collapse, CollapseProps } from 'react-collapse';

interface EndringsloggInnholdProps {
    url?: string;
    linkTekst?: string;
    dato: string;
    innholdsTekst: string;
    innholdsOverskrift: string;
    nyeNotifikasjoner: boolean;
}

function EndringsloggInnhold(props: EndringsloggInnholdProps) {
    let linkTag: any;
    if (props.url !== undefined) {
        if (props.linkTekst !== undefined) {
            linkTag = <><a href={props.url} target="_blank">{props.linkTekst}</a><i> (Åpnes i ny fane)</i></>;
        } else {
            linkTag = <><a href={props.url} target="_blank">{props.url}</a><i> (Åpnes i ny fane)</i></>;
        }
    }
    return (
        <div className="endringslogg-rad">
            <div className="endringslogg-skille">
                <div className={classNames({
                    'endringslogg-info-ingen-notifikasjoner ': !props.nyeNotifikasjoner,
                    'endringslogg-info-nye-notifikasjoner endringslogg-info-kolonne ': props.nyeNotifikasjoner
                })}/>
                <div className="endringslogg-innhold endringslogg-kolonne">
                    <EtikettLiten>{props.dato}</EtikettLiten>
                    <div className="endringslogg-indent">
                        <Element> {props.innholdsOverskrift} </Element>
                        <Normaltekst> {props.innholdsTekst} </Normaltekst>
                        {linkTag}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getDatoStreng(dato: Date) {
    let dd = String(dato.getDate()).padStart(2, '0');
    let mm = 'jul'; // TODO: Endre dette til å ikke være hardkodet
    let yyyy = dato.getFullYear();
    return `${dd}. ${mm}. ${yyyy}`;
}

export function EndringsloggKnapp(props) {
    const versjonsnummer = '0.1.7';
    const [nyeNotifikasjoner, setNyeNotifikasjoner] = useState(!harSettEndringsinlegg(versjonsnummer));
    const [open, setOpen] = useState(false);
    const datoStreng = getDatoStreng(new Date());

    return (
        <>
            <button className="endringslogg-dropDown endringslogg-container" onClick={() => setOpen(!open)}>
                Oppdateringer
            </button>
            <TransitionGroup component={null}>
                {open && (
                    <CSSTransition classNames="collapse-container" timeout={400}>
                        <div className='collapse-container'>
                            <div className={'collapse-header'}>
                                Oppdateringer
                            </div>
                            <EndringsloggInnhold dato={"18. JUN. 2019"}
                                                 innholdsOverskrift="Laste ned og skrive ut CV"
                                                 innholdsTekst="Når du går inn på en bruker kan du nå laste ned CV-en under fanen «Detaljer». Da får du en bedre utskrift."
                                                 nyeNotifikasjoner={nyeNotifikasjoner}
                            />
                            <EndringsloggInnhold dato={"06. JUN. 2019"}
                                                 innholdsOverskrift="Visning av profilering i Detaljer"
                                                 innholdsTekst="Nå kan du se profileringsresultatet fra brukerens registrering. Du finner det under «Registrering» i fanen «Detaljer» når du går inn på en bruker."
                                                 nyeNotifikasjoner={nyeNotifikasjoner}
                            />
                            <EndringsloggInnhold dato={"29. MAR. 2019"}
                                                 innholdsOverskrift="Manuell registrering"
                                                 innholdsTekst="Ny løsning for å registrere brukere manuelt i Modia. Når du går inn på en bruker finner du det i Veilederverktøy (tannhjulet). Arena-oppgaven «Motta person» skal ikke lenger benyttes. "
                                                 nyeNotifikasjoner={nyeNotifikasjoner}
                            />
                        </div>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </>
    );
}

const ENDRING_PREFIX = 'Endringslogg';

function harSettEndringsinlegg(versjon: string) {
    const senesteVersjonSett = window.localStorage.getItem(ENDRING_PREFIX);
    return senesteVersjonSett != null && senesteVersjonSett === versjon;
}

function handleSettEndring(versjon) {
    window.localStorage.setItem(ENDRING_PREFIX, versjon);
}
