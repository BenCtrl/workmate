import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { HiOutlineRectangleStack } from "react-icons/hi2";

import { Button, Modal } from '../CommonComponents'
import NewStickyNotesGroupModal from '../sticky-notes/NewStickyNotesGroupModal';
import StickyNoteGroup from '../sticky-notes/StickyNoteGroup';
import '../../styling/noteslist.css'

const NotesList = () => {
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const fetchGroups = async () => {
    try {
        const response = await fetch('/api/stickynote_groups');
        const data = await response.json();
        setGroups(data);
    } catch(error) {
        console.log('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <div className='sticky-notes-controls'>
        <Button children={<HiOutlineRectangleStack />} toolTip={'Create new group'} onClick={() => {setShowGroupModal((state) => !state)}} />
      </div>
      <div id="notes-list-wrapper">
        {groups.map((group) => {
          // Skip over default group to avoid duplicate render of group (ID is always assumed as 1 as should be primary group)
          return group.id <= 1 ? <StickyNoteGroup key={group.id} group={group} collapsed={true} isDefault={true} /> : <StickyNoteGroup key={group.id} getGroups={fetchGroups} group={group} />
        })}
      </div>

      {showGroupModal &&
        createPortal(
          <Modal children={<NewStickyNotesGroupModal onNewGroupSubmit={fetchGroups} />} onClose={() => setShowGroupModal(false)} modalHeading={'New Notes Group'}/>,
          document.body
        )
      }
    </>
  )
}

export default NotesList;