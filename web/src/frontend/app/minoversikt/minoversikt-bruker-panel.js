import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import Hybridpanel from '../components/tabell/hybridpanel/hybridpanel';
import Brukerinformasjon from '../components/tabell/brukerinformasjon';
import MinoversiktDatokolonner from './minoversikt-datokolonner';
import Etiketter from '../components/tabell/etiketter';
import { filtervalgShape, brukerShape } from './../proptype-shapes';


function MinoversiktBrukerPanel({ bruker, settMarkert, enhetId, filtervalg, veilederNavn }) {
    const { ytelse } = filtervalg;
    const childrenHead =
        (<div className="brukerpanel">
            <Brukerinformasjon
                bruker={bruker}
                enhetId={enhetId}
                settMarkert={settMarkert}
            />
            <MinoversiktDatokolonner bruker={bruker} ytelse={ytelse} />
            <Etiketter bruker={bruker} />
        </div>);

    const childrenBody =
        (<div className="brukerpanel__body">
            <h5>
                <FormattedMessage id="arbeidsliste.kommentar.header" />
            </h5>
            {bruker.arbeidsliste.kommentar}
            <p className="arbeidsliste--panel-footer">
                <FormattedMessage
                    id="arbeidsliste.kommentar.footer"
                    values={{
                        dato: bruker.arbeidsliste.endringstidspunkt,
                        veilederNavn
                    }}
                />
                <a className="lenke lenke--frittstående arbeidsliste--rediger-lenke">
                    Rediger
                </a>
            </p>
        </div>

        );

    return (
        bruker.arbeidsliste.arbeidslisteAktiv ?
            <Hybridpanel childrenHead={childrenHead} childrenBody={childrenBody} />
            :
            <div className="panel_hode">{childrenHead}</div>
    );
}

MinoversiktBrukerPanel.propTypes = {
    bruker: brukerShape,
    veilederNavn: PT.string.isRequired,
    settMarkert: PT.func.isRequired,
    enhetId: PT.string.isRequired,
    filtervalg: filtervalgShape.isRequired
};

export default MinoversiktBrukerPanel;
