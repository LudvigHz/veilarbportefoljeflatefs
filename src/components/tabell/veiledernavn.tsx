import * as React from 'react';
import {BrukerModell, VeilederModell} from '../../model-interfaces';
import {Tag} from '@navikt/ds-react';

interface VeiledernavnProps {
    className?: string;
    bruker: BrukerModell;
    skalVises: boolean;
    veileder?: VeilederModell;
}

function VeilederNavn({className, bruker, skalVises, veileder}: VeiledernavnProps) {
    if (!skalVises) {
        return null;
    }

    const veilederNavn = <span>{veileder ? `${veileder.etternavn}, ${veileder.fornavn}` : ''}</span>;

    const ufordeltBrukerEtikett = <Tag variant="info">Ufordelt bruker</Tag>;

    return <div className={className}>{bruker.nyForEnhet ? ufordeltBrukerEtikett : veilederNavn}</div>;
}

export default VeilederNavn;
