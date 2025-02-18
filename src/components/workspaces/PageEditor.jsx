import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useLoaderData, useBeforeUnload, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import { toast } from 'react-toastify';
import { info, warn, error } from '@tauri-apps/plugin-log';

import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import {Underline as tiptapUnderline} from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Codeblock,
  QuoteBlock,
  OrderedList,
  UnorderedList,
  HorizontalRule,
  Heading,
  FileText,
  FileAdd,
  FileDone,
  Pencil,
  WarningTriangle,
  Underline
} from '../Icons';

import database from '../../database/database';
import { Button, ButtonGroup } from '../CommonComponents';
import { AppSettingsContext } from '../../App';
import { addPageLoader, updatePageLoader } from './Pages';
import '../../styling/page-editor.css';

const extensions = [
  StarterKit,
  CodeBlock,
  TextStyle,
  tiptapUnderline,
  Placeholder.configure({
    placeholder: 'Start your new page...'
  }),
  CharacterCount.configure({
    wordCounter: (text) => text.split(/\s+/).filter((word) => word !== '').length,
  })
];

const PageEditor = () => {
  const page = useLoaderData();
  const navigate = useNavigate();

  const [pageHeader, setPageHeader] = useState(page ? page.title : 'New Page');
  const [selectedHeading, setSelectedHeading] = useState(1);
  const [changesMade, setChangesMade] = useState(false);
  const [confirmHeading, setConfirmHeading] = useState(false);
  const [isEditing, setIsEditing] = useState(page ? false : true);

  const content = page ? JSON.parse(page.page_content) : '';
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const editor = useEditor({
    extensions,
    content,
    onUpdate: (updateEvent) => {
      setChangesMade(true);
    }
  });
  
  
  const submitPage = async (buttonEvent) => {
    let finalPageHeader = pageHeader;
    const buttonId = buttonEvent.currentTarget.id;

    if (buttonId === 'page-save-as') {
      if (await database.select('SELECT * FROM pages WHERE title = $1', [pageHeader]).then(result => {return result.length}) > 0) {
        if (SETTINGS.PREVENT_DUPLICATES) {
          error(`Page cannot be created - Page with title '${pageHeader}' already exists`);
          toast.error(`Page with title '${pageHeader}' already exists`);
          return;
        } else {
          finalPageHeader = `${finalPageHeader}-Copy`;
        }
      }
    }

    if (!finalPageHeader.trim()) {
      error('Page cannot be saved - Title is empty');
      toast.error('Page title cannot be empty');
      return;
    } else if (finalPageHeader.length > 64) {
      error('Page cannot be saved - Character count of title is greater than limit (64 characters)');
      toast.error('Page title too long (no more than 64 characters)');
      return;
    }

    const newPageData = {
      title: finalPageHeader,
      page_content: JSON.stringify(editor.getJSON()),
      created_timestamp: page ? page.created_timestamp : Date.now(),
      edited_timestamp: Date.now()
    }

    // Crude solution for embedding existing page ID into request body, more elegant solution should be found
    if (buttonId !== 'page-save-as' && page) {
      newPageData.id = page.id
    }

    try {
      if (buttonId === 'page-save-as' || buttonId === 'page-save' && !page) {
        const newPageID = await addPageLoader(newPageData);
        navigate(`/pages/editor/${newPageID}`);

        info(`New page with ID '${newPageID}' was successfully created`);
        toast.success(`New page successfully created`);
      } else {
        updatePageLoader(newPageData);

        toast.success('Page successfully saved');
        info(`Page with ID '${newPageData.id}' successfully updated`);
      }

      setChangesMade(false);
    } catch (error) {
      console.error(`Error while attempting to save page: ${error}`);
    }
  }

  useBeforeUnload(useCallback((unloadEvent) => {
    changesMade && unloadEvent.preventDefault();
  }));

  useEffect(() => {
    editor.setEditable(isEditing, false);
  }, [isEditing]);

  return (
    <>
      <div className="page-editor-header">
        <WarningTriangle className={`unsaved-changes-icon ${!changesMade && 'hidden'}`} title="Unsaved Changes!" />
        <input value={pageHeader} placeholder={'Page Title...'} onChange={(changeEvent) => {setPageHeader(changeEvent.target.value); setChangesMade(true)}} className="page-editor-title" disabled={!isEditing}></input>
        {!isEditing ? <Button toolTip="Edit Page" children={<Pencil />} onClick={() => {setIsEditing((state) => !state)}}/> : <Button toolTip="View Page" children={<FileText />} onClick={() => {setIsEditing((state) => !state)}}/>}
      </div>
      {isEditing &&
        <div className="page-editor-nodes">
          <ButtonGroup>
            <Button className='mini' toolTip="Undo" children={<ArrowLeft />} onClick={() => {editor.chain().focus().undo().run()}}/>
            <Button className='mini' toolTip="Redo" children={<ArrowRight />} onClick={() => {editor.chain().focus().redo().run()}}/>
          </ButtonGroup>

          <ButtonGroup style={{marginLeft: '1rem'}}>
            <Button className='mini' toolTip="Bold" children={<Bold />} onClick={() => {editor.chain().focus().toggleBold().run()}}/>
            <Button className='mini' toolTip="Italic" children={<Italic />} onClick={() => {editor.chain().focus().toggleItalic().run()}}/>
            <Button className='mini' toolTip="Strikethrough" children={<Strikethrough />} onClick={() => {editor.chain().focus().toggleStrike().run()}}/>
            <Button className='mini' toolTip="Underline" children={<Underline />} onClick={() => {editor.chain().focus().toggleUnderline().run()}}/>
            <Button className='mini' toolTip="Code" children={<Code />} onClick={() => {editor.chain().focus().toggleCode().run()}}/>
            <Button className='mini' toolTip="Code block" children={<Codeblock />} onClick={() => {editor.chain().focus().toggleCodeBlock().run()}}/>
            <Button className='mini' toolTip="Block quote" children={<QuoteBlock />} onClick={() => {editor.chain().focus().toggleBlockquote().run()}}/>
            <Button className='mini' toolTip="Horizontal rule" children={<HorizontalRule />} onClick={() => {editor.chain().focus().setHorizontalRule().run()}}/>
            <Button className='mini' toolTip="Bullet list" children={<UnorderedList />} onClick={() => {editor.chain().focus().toggleBulletList().run()}}/>
            <Button className='mini' toolTip="Ordered list" children={<OrderedList />} onClick={() => {editor.chain().focus().toggleOrderedList().run()}}/>
          </ButtonGroup>

          <ButtonGroup style={{marginLeft: '1rem'}}>
            <Button toolTip="Apply heading" className={`mini ${confirmHeading ? 'warning' : ''}`} children={<Heading />} onClick={() => {editor.chain().focus().toggleHeading({ level: selectedHeading }).run(); setConfirmHeading(false)}}/>
            {/* TODO - Review if heading apply button is better solution than setting heading styling on selection of heading as implemented below */}
            <select className='mini' onChange={(changeEvent) => {setSelectedHeading(parseInt(changeEvent.target.value)); setConfirmHeading(true)}} id="heading-select">
            {/* <select onChange={(changeEvent) => {console.log('heading selected'); editor.chain().focus().toggleHeading({ level: parseInt(changeEvent.target.value) }).run()}} id="heading-select"> */}
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>
          </ButtonGroup>

          <ButtonGroup style={{marginLeft: 'auto'}}>
            <Button className='mini' id="page-save-as" children={<FileAdd />} toolTip={"Save As"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} />
            <Button className='mini' id="page-save" children={<FileDone />} toolTip={changesMade ? "Save (Unsaved Changes)" : "Save"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} disabled={!changesMade} />
          </ButtonGroup>
        </div>
      }

      <EditorContent editor={editor} className='page-editor' />
      {SETTINGS.WORD_COUNTER && <div className="page-editor-word-count">Words: {editor.storage.characterCount.words()}</div>}
    </>
  )
}

const pageLoader = async ({params}) => {
  try {
    const pageID = params.id;
    const pages = await database.select('SELECT * FROM pages WHERE id = $1;', [pageID]);

    if (pages.length > 0) {
      info(`Successfully retrieved page with ID '${pageID}'`);
      return pages[0];
    } else {
      warn(`No page found with ID '${pageID}'`);
      return;
    }
  } catch(error) {
    console.error(`Error while retrieving page with ID '${pageID}': ${error}`);
  }
}

export { PageEditor as default, pageLoader };