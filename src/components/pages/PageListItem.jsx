import React from 'react';
import { NavLink } from 'react-router-dom';

import { Button } from '../CommonComponents';
import { Trash } from '../Icons';

const PageListItem = ({page, deletePage}) => {
  return (
    <li className="page-list-item">
      <NavLink to={`/pages/editor/${page.id}`}>
        <span className="page-list-item-title"><b>{page.title}</b></span>
        <span className="page-list-item-date-edited"><span>Last Edited: </span>{new Date(page.edited_timestamp).toLocaleDateString()} | {new Date(page.edited_timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
      </NavLink>
      <Button className="page-list-item-options" onClick={() => {deletePage(page.id)}} children={<Trash />} toolTip="Delete page" />
    </li>
  )
}

export default PageListItem