import React from 'react';
import {FiltreringStatusGruppe} from './ufordelte-brukere';
import BarInputGruppe from '../../../components/barinput/barinput-gruppe';
import {INAKTIVE_BRUKERE} from '../../filter-konstanter';
import {useStatusTallSelector} from '../../../hooks/redux/use-statustall';
import {BarInputRadio} from '../../../components/barinput/barinput-radio';

export function FiltreringStatusInavtiveBrukere(props: FiltreringStatusGruppe) {
    const statusTall = useStatusTallSelector();

    return (
        <BarInputGruppe>
            <BarInputRadio
                filterNavn="inaktiveBrukere"
                handleChange={props.handleChange}
                antall={statusTall.inaktiveBrukere}
                checked={props.ferdigfilterListe.includes(INAKTIVE_BRUKERE)}
            />
        </BarInputGruppe>
    );
}
