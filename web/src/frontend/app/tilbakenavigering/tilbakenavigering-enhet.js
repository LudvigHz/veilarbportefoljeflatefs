import React, { PropTypes as PT } from 'react';
import queryString from 'query-string';
import history from '../history';
import { store } from '../index';
import { settFiltervalg } from '../ducks/filtrering';
import { velgEnhetForVeileder } from '../ducks/enheter';
import { settValgtVeilederIKonstruktor } from '../ducks/utils';

function TilbakenavigeringEnhet({}) {
  const lagretState = JSON.parse(localStorage.previousEnhetState);
  console.log('lagretState', lagretState);

  if(lagretState.path ==='/veilarbportefoljeflatefs/veiledere') {
        settValgtEnhet(lagretState.enheter.valgtEnhet.enhet.enhetId);
        history.replace('/veiledere');
  }else if(lagretState.path ==='/veilarbportefoljeflatefs/enhet') {
        settValgtEnhet(lagretState.enheter.valgtEnhet.enhet.enhetId);
        store.dispatch(settFiltervalg(lagretState.filtrering.filtervalg));
        history.replace('/enhet');
  }

  return null;
};

const settValgtEnhet = (enhetId) => {
    settValgtVeilederIKonstruktor(enhetId);
    store.dispatch(velgEnhetForVeileder(enhetId));

};

export default TilbakenavigeringEnhet;
