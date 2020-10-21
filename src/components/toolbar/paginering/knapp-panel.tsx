import * as React from 'react';
import classNames from 'classnames';

interface KnappPanelProps {
    children: React.ReactChild | React.ReactChildren;
    disabled?: boolean;
    pressed?: boolean;
    onClick?: () => void;
    selected?: boolean;
}

function KnappPanel({children, disabled = false, pressed = false, selected = false, ...props}: KnappPanelProps) {
    const classes = classNames('paginering__knapp', {
        disabled,
        'paginering__knapp--pressed': pressed
    });
    return (
        <button className={classes} aria-disabled={disabled} aria-pressed={pressed} disabled={disabled} {...props}>
            {children}
        </button>
    );
}

export default KnappPanel;
