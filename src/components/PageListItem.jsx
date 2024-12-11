import React from 'react'
import { HiEllipsisVertical } from "react-icons/hi2";
import Button from './Button';
import { NavLink } from 'react-router-dom';

const PageListItem = ({page}) => {
  return (
    <li className="page-list-item">
      <NavLink to={`/pages/editor/${page.id}`}>
        <span className="page-list-item-title"><b>{page.title}</b></span>
        <span className="page-list-item-description">{page.description}</span>
        <span className="page-list-item-date-edited"><span style={{color: '#0000004f'}}>Last Edited: </span>{page.dateTimeEdited}</span>
      </NavLink>
      <Button className="page-list-item-options" children={<HiEllipsisVertical />} toolTip="Page Options" />
    </li>
  )
}

export default PageListItem