import React from 'react';
import {Alert, Link} from '@navikt/ds-react';

export const HuskelappInfoAlert = () => (
    <Alert variant="info">
        Du skal ikke skrive sensitive opplysninger eller annen informasjon som personen skal ha innsyn i her.{' '}
        <Link>
            <b>Mer informasjon om huskelapp på Navet.</b>
        </Link>
    </Alert>
);
