import React from 'react';
import { IKKE_PERMITTERTE_ETTER_NIENDE_MARS } from '../../filter-konstanter';
import { useStatusTallSelector } from '../../../hooks/redux/use-statustall';
import BarInputCheckbox from '../../../components/barinput/barinput-checkbox';

export interface FiltreringStatusGruppe {
    ferdigfilterListe: string[];
    handleChange: (e: any) => void;
}

function FiltreringStatusIkkePermitterteEtterNiendeBrukere(props: FiltreringStatusGruppe) {
    const statusTall = useStatusTallSelector();

    return (
        <BarInputCheckbox
            filterNavn="ikkePermitterteEtterNiendeMars"
            max={statusTall.totalt}
            antall={statusTall.ikkePermitterteEtterNiendeMars}
            handleChange={props.handleChange}
            checked={props.ferdigfilterListe.includes(IKKE_PERMITTERTE_ETTER_NIENDE_MARS)}
            labelTekst={<>Alle <strong>utenom</strong> permitterte etter 09.03.2020</>}
        />
    );
}

export default FiltreringStatusIkkePermitterteEtterNiendeBrukere;
