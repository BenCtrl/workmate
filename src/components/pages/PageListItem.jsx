import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { DeleteConfirmButton } from '../CommonComponents';
import { IconTrash } from '../Icons';

const PageListItem = ({page, deletePage}) => {
  const [pageEditedDateTimeFormat, setPageEditedTimeFormat] = useState(new Intl.DateTimeFormat("en-GB", {dateStyle: "short",timeStyle:"short"}));

  return (
    <li className="page-list-item">
      <NavLink to={`/pages/editor/${page.id}`}>
        <span className="page-list-item-title"><b>{page.title}</b></span>
        <span className="page-list-item-date-edited">Last Edited: {pageEditedDateTimeFormat.format(new Date(page.edited_timestamp))}</span>
      </NavLink>
      <DeleteConfirmButton className="page-list-item-options" onClick={() => {deletePage(page)}} children={<IconTrash />} toolTip="Delete Page" />
    </li>
  )
}

export default PageListItem