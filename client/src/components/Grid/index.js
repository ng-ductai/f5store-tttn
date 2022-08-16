import React from 'react';

const Grid = (props) => {
    const { col, mdCol, smCol, gap, children, bgr } = props;

    const styles = {
        gap: gap ? `${gap}px` : '0',
        background: bgr ? '#fff' : '',
    };

    const colVl = col ? `grid-col-${col}` : '';
    const mdColVl = mdCol ? `grid-col-md-${mdCol}` : '';
    const smColVl = smCol ? `grid-col-sm-${smCol}` : '';

    return (
        <div className={`grid ${colVl} ${mdColVl} ${smColVl}`} style={styles}>
            {children}
        </div>
    );
}

export default Grid;
