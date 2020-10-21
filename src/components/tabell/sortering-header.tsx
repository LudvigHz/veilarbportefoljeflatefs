import * as React from 'react';
import classNames from 'classnames';
import {Sorteringsfelt, Sorteringsrekkefolge} from '../../model-interfaces';
import Header, {HeaderProps} from './header';
import {ReactComponent as PilAscending} from './arrow-up.svg';
import {ReactComponent as PilDescending} from './arrow-down.svg';
import './tabell.less';
import {OrNothing} from '../../utils/types/types';

interface SorteringHeaderProps extends HeaderProps {
    sortering: OrNothing<Sorteringsfelt>;
    onClick: (sortering: string) => void;
    rekkefolge: OrNothing<Sorteringsrekkefolge>;
    erValgt: boolean;
    tekst: React.ReactNode;
    title?: string;
    headerId: string;
}

function SorteringHeader({
    sortering,
    onClick,
    rekkefolge,
    erValgt,
    tekst,
    skalVises = true,
    className = '',
    title,
    headerId
}: SorteringHeaderProps) {
    const ariaLabel = erValgt && rekkefolge !== Sorteringsrekkefolge.ikke_satt ? rekkefolge : 'inaktiv';
    const sorteringspil = () => {
        const className = 'sorteringheader__pil';
        if (ariaLabel === 'ascending') {
            return <PilAscending className={className} />;
        } else if (ariaLabel === 'descending') {
            return <PilDescending className={className} />;
        } else {
            return null;
        }
    };

    return (
        <Header skalVises={skalVises} className={className} headerId={headerId}>
            <div className="sorteringheader__lenke">
                <button
                    onClick={() => onClick(sortering || Sorteringsrekkefolge.ikke_satt)}
                    className={classNames(
                        'lenke lenke--frittstaende text--left',
                        {valgt: erValgt},
                        {'valgt-sortering': erValgt}
                    )}
                    aria-pressed={erValgt}
                    aria-label={
                        erValgt && rekkefolge && rekkefolge !== Sorteringsrekkefolge.ikke_satt ? rekkefolge : 'inaktiv'
                    }
                    title={title}
                >
                    {tekst}
                </button>
                {sortering === 'etternavn' ? ', Fornavn' : null}
            </div>
            {sorteringspil()}
        </Header>
    );
}

export default SorteringHeader;
