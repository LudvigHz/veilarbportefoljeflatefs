import React, { PropTypes as PT } from 'react';
import { EtikettInfo } from 'nav-frontend-etiketter';
import classNames from 'classnames';

const cls = (className, type) => classNames('tabelletikett', className, {
    [`tabelletikett--${type}`]: !!type
});

function Tabelletiketter({ className, type, ...props}) {
    // http://stash.devillo.no/projects/NAVFRONT/repos/nav-frontend-moduler/pull-requests/57/overview legger til typo
    return (<EtikettInfo className={cls(className, type)} {...props} typo="undertekst" />);
}

Tabelletiketter.propTypes = {
    className: PT.string,
    type: PT.oneOf(['nybruker'])
};
Tabelletiketter.defaultProps = {
    className: undefined,
    type: undefined
};

export default Tabelletiketter;
