import React from 'react';
import { NavLink } from 'react-router-dom';

import { DeleteConfirmButton } from '../CommonComponents';
import { IconTrash } from '../Icons';

const PageListItem = ({page, deletePage}) => {
  return (
    <li className="page-list-item">
      <NavLink to={`/pages/editor/${page.id}`}>
        <span className="page-list-item-title"><b>{page.title}</b></span>
        <span className="page-list-item-date-edited"><span>Last Edited: </span>{new Date(page.edited_timestamp).toLocaleDateString()} | {new Date(page.edited_timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
      </NavLink>
      <DeleteConfirmButton className="page-list-item-options" onClick={() => {deletePage(page)}} children={<IconTrash />} toolTip="Delete Page" />
    </li>
  )
}

export default PageListItem