import React from 'react'
import { HiOutlineTrash } from "react-icons/hi2";
import { NavLink } from 'react-router-dom';
import Button from '../common/Button';

const PageListItem = ({page, deletePage}) => {
  return (
    <li className="page-list-item">
      <NavLink to={`/pages/editor/${page.id}`}>
        <span className="page-list-item-title"><b>{page.title}</b></span>
        <span className="page-list-item-description">{page.description}</span>
        <span className="page-list-item-date-edited"><span>Last Edited: </span>{new Date(page.dateTimeEdited).toLocaleDateString()} | {new Date(page.dateTimeEdited).toLocaleTimeString([], {timeStyle: 'short'})}</span>
      </NavLink>
      <Button className="page-list-item-options" onClick={() => {deletePage(page.id)}} children={<HiOutlineTrash />} toolTip="Delete page" />
    </li>
  )
}

export default PageListItem