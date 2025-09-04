import React, { useContext, useEffect, useState } from 'react';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

import { Alert, Button, CheckBoxSlider } from '../CommonComponents';
import '../../styling/app-settings.css';

import { AppSettingsContext } from '../../App';

const AppSettings = () => {
  const {appSettings, setAppSettings} = useContext(AppSettingsContext);

  // App settings checkbox states
  const [toolTipsEnabled, setTooltipsEnabled] = useState(appSettings.TOOLTIPS);
  const [darkModeEnabled, setDarkModeEnabled] = useState(appSettings.DARKMODE);
  const [wordCounterEnabled, setWordCounterEnabled] = useState(appSettings.WORD_COUNTER);
  const [openPageInEditModeEnabled, setOpenPageInEditModeEnabled] = useState(appSettings.OPEN_PAGE_IN_EDIT_MODE);
  const [hideCompletedNotes, setHideCompletedNotes] = useState(appSettings.HIDE_COMPLETED_NOTES);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(appSettings.CONFIRM_BEFORE_DELETE);
  const [preventDuplicates, setPreventDuplicates] = useState(appSettings.PREVENT_DUPLICATES);
  const [fullWidthPageEditor, setFullWidthPageEditor] = useState(appSettings.FULL_WIDTH_PAGE_EDITOR);
  const [currentTimeZoneEnabled, setCurrentTimeZoneEnabled] = useState(appSettings.CURRENT_TIME_ZONE_ENABLED);
  const [closeModalOnSubmit, setCloseModalOnSubmit] = useState(appSettings.CLOSE_MODAL_ON_SUBMIT);

  const [changesMade, setChangesMade] = useState(false);

  const [currentTimeZone, setCurrentTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const updateSettings = async (event) => {
    event.preventDefault();

    const newSettings = {
      CLOSE_MODAL_ON_SUBMIT: closeModalOnSubmit,
      CURRENT_TIME_ZONE_ENABLED: currentTimeZoneEnabled,
      CONFIRM_BEFORE_DELETE: confirmBeforeDelete,
      DARKMODE: darkModeEnabled,
      FULL_WIDTH_PAGE_EDITOR: fullWidthPageEditor,
      HIDE_COMPLETED_NOTES: hideCompletedNotes,
      OPEN_PAGE_IN_EDIT_MODE: openPageInEditModeEnabled,
      PREVENT_DUPLICATES: preventDuplicates,
      TOOLTIPS: toolTipsEnabled,
      WORD_COUNTER: wordCounterEnabled
    }

    try {
      await writeTextFile('app_settings.json', JSON.stringify(newSettings), {baseDir: BaseDirectory.AppData});

      setAppSettings(newSettings);
      setChangesMade(false);

      info('Successfully updated application settings')
    } catch(error) {
      error(`Error while updating settings: ${error}`);
    }
  }

  return (
    <>
      <h1>Settings</h1>
      <form id="app-settings-form" onSubmit={updateSettings} onChange={() => {!changesMade && setChangesMade(!changesMade)}}>
        <fieldset>
          <legend>General</legend>
          <CheckBoxSlider labelContent="Tooltips" checkBoxID="toggle-tooltips" checked={toolTipsEnabled} onChange={() => {setTooltipsEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Dark mode" checkBoxID="toggle-darkmode" checked={darkModeEnabled} onChange={() => {setDarkModeEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Confirm before delete" checkBoxID="toggle-confirm-before-delete" checked={confirmBeforeDelete} onChange={() => {setConfirmBeforeDelete((state) => !state)}} />
          <CheckBoxSlider labelContent="Prevent duplicates" checkBoxID="toggle-prevent-duplicates" checked={preventDuplicates} onChange={() => {setPreventDuplicates((state) => !state)}} />
          <CheckBoxSlider labelContent="Close modals on submit" checkBoxID="toggle-close-modals-on-submit" checked={closeModalOnSubmit} onChange={() => {setCloseModalOnSubmit((state) => !state)}} />
        </fieldset>

        <fieldset>
          <legend>Sticky Notes</legend>
          <CheckBoxSlider labelContent="Hide completed notes" checkBoxID="toggle-completed-sticky-note-archiving" checked={hideCompletedNotes} onChange={() => {setHideCompletedNotes((state) => !state)}} />
        </fieldset>

        <fieldset>
          <legend>Page Editor</legend>
          <CheckBoxSlider labelContent="Open in edit mode" checkBoxID="toggle-page-editor-open-in-edit-mode" checked={openPageInEditModeEnabled} onChange={() => {setOpenPageInEditModeEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Word counter" checkBoxID="toggle-page-editor-word-count" checked={wordCounterEnabled} onChange={() => {setWordCounterEnabled((state) => !state)}} />
          <CheckBoxSlider labelContent="Full width editor" checkBoxID="toggle-page-editor-full-width" checked={fullWidthPageEditor} onChange={() => {setFullWidthPageEditor((state) => !state)}} />
        </fieldset>

        <fieldset>
          <legend>Calendar</legend>
          <CheckBoxSlider labelContent={`Enable local time zone (${currentTimeZone})`} checkBoxID="toggle-current-time-zone" checked={currentTimeZoneEnabled} onChange={() => {setCurrentTimeZoneEnabled((state) => !state)}} />
        </fieldset>

        {changesMade && <Alert alertType="warning" message="Unsaved Changes!" />}
        <Button id="app-settings-save" children={'Save'} disabled={!changesMade}/>
      </form>
    </>
  )
}

export default AppSettings