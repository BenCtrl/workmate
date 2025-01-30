import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { HiOutlineRectangleStack } from "react-icons/hi2";

import { Button, Modal } from '../common/CommonComponents'
import NewStickyNotesGroupModal from '../sticky-notes/NewStickyNotesGroupModal';
import StickyNoteGroup from '../sticky-notes/StickyNoteGroup';
import '../../styling/noteslist.css'

const NotesList = () => {
  const [groups, setGroups] = useState([]);
  const [defaultGroup, setDefaultGroup] = useState({});
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

  const fetchDefaultGroup = async (groupID) => {
    try {
        const response = await fetch(`/api/stickynote_groups/${groupID}`);
        const data = await response.json();
        setDefaultGroup(data);
    } catch(error) {
        console.log('Error fetching data', error);
    }
  }

  useEffect(() => {
    fetchGroups();
    fetchDefaultGroup(1); // Fetches the permanent default group that cannot be deleted
  }, []);

  return (
    <>
      <div className='sticky-notes-controls'>
        <Button children={<HiOutlineRectangleStack />} toolTip={'Create new group'} onClick={() => {setShowGroupModal((state) => !state)}} />
      </div>
      <div id="notes-list-wrapper">
        <StickyNoteGroup group={defaultGroup} collapsed={true} isDefault={true} />

        {groups.map((group) => {
          // Skip over default group to avoid duplicate render of group
          return group.id > 1 && <StickyNoteGroup key={group.id} getGroups={fetchGroups} group={group} />
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