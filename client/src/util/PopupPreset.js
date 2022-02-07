import { Popup } from 'semantic-ui-react';
import React from 'react'

function PopupPreset({ content, children }){
    return <Popup content={content} trigger={children}/>
}

export default PopupPreset;