import React from 'react';
import classNames from 'classnames';
import {Heading} from '@navikt/ds-react';
import './modal.less';

interface OwnProps {
    className?: string;
    tittel?: React.ReactNode;
}

function ModalHeader({className, tittel}: OwnProps) {
    return (
        <Heading size="xlarge" level="1" className={classNames('modal-header', className)}>
            {tittel}
        </Heading>
    );
}

export default ModalHeader;
