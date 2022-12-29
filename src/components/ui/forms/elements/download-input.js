import React from 'react';
import urls from '@services/api/api.paths';
import styled from 'styled-components';
import 'twin.macro';

const DownloadInput = ({ label, downloadUrl, helperText, style }) => {
    return (
        <Div hasRight = {style.mdRight} tw = "mt-5 mb-4">
            <a href = { `/${urls[`${downloadUrl}`]}` } download = {helperText} tw = "py-3 text-sm font-semibold rounded px-7 bg-secondary-100 active:outline-none">{label}</a>
        </Div>
    )
}

const Div = styled.div`
    color: ${p => p.theme.themeColor};
    ${p => p.hasRight ? { marginLeft: '6%' } : ''}
`;

export default DownloadInput
