import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useLoaderData, useBeforeUnload, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import { toast } from 'react-toastify';
import { info, warn, error } from '@tauri-apps/plugin-log';

import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';

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
  Pencil
} from '../Icons';

import database from '../../database/database';
import { Button } from '../CommonComponents';
import { AppSettingsContext } from '../../App';
import { addPageLoader, updatePageLoader } from './Pages';
import '../../styling/page-editor.css';

const extensions = [
  StarterKit,
  CodeBlock,
  TextStyle,
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

  const content = page ? JSON.parse(page.page_content) : '<p style="color: #9d9d9d">Start your new page!</p>';
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const editor = useEditor({
    extensions,
    content,
    onUpdate: (updateEvent) => {
      setChangesMade(true);
    }
  });
  
  
  const submitPage = async (buttonEvent) => {
    const buttonId = buttonEvent.currentTarget.id;
    
    if (!pageHeader.trim()) {
      error('Page cannot be saved - Title is empty');
      toast.error('Page title cannot be empty');
      return;
    } else if (pageHeader.length > 64) {
      error('Page cannot be saved - Character count of title is greater than limit (64 characters)');
      toast.error('Page title too long (no more than 64 characters)');
      return;
    }

    const newPageData = {
      title: pageHeader,
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
    editor.setEditable(isEditing);
  }, [isEditing]);

  return (
    <>
      <div className="page-editor-header">
        <input value={pageHeader} placeholder={'Page Title...'} onChange={(changeEvent) => {setPageHeader(changeEvent.target.value); setChangesMade(true)}} className="page-editor-title" disabled={!isEditing}></input>
        {!isEditing ? <Button toolTip="Edit Page" children={<Pencil />} onClick={() => {setIsEditing((state) => !state)}}/> : <Button toolTip="View Page" children={<FileText />} onClick={() => {setIsEditing((state) => !state)}}/>}
      </div>
      {isEditing &&
        <div className="page-editor-nodes">
          <Button toolTip="Undo" children={<ArrowLeft />} onClick={() => {editor.chain().focus().undo().run()}}/>
          <Button toolTip="Redo" children={<ArrowRight />} onClick={() => {editor.chain().focus().redo().run()}}/>

          <span className="page-editor-nodes-divider"></span>

          <Button toolTip="Bold" children={<Bold />} onClick={() => {editor.chain().focus().toggleBold().run()}}/>
          <Button toolTip="Italic" children={<Italic />} onClick={() => {editor.chain().focus().toggleItalic().run()}}/>
          <Button toolTip="Strikethrough" children={<Strikethrough />} onClick={() => {editor.chain().focus().toggleStrike().run()}}/>
          <Button toolTip="Code" children={<Code />} onClick={() => {editor.chain().focus().toggleCode().run()}}/>
          <Button toolTip="Code block" children={<Codeblock />} onClick={() => {editor.chain().focus().toggleCodeBlock().run()}}/>
          <Button toolTip="Block quote" children={<QuoteBlock />} onClick={() => {editor.chain().focus().toggleBlockquote().run()}}/>
          <Button toolTip="Horizontal rule" children={<HorizontalRule />} onClick={() => {editor.chain().focus().setHorizontalRule().run()}}/>
          <Button toolTip="Bullet list" children={<UnorderedList />} onClick={() => {editor.chain().focus().toggleBulletList().run()}}/>
          <Button toolTip="Ordered list" children={<OrderedList />} onClick={() => {editor.chain().focus().toggleOrderedList().run()}}/>

          <span className="page-editor-nodes-divider"></span>

          <Button toolTip="Apply heading" className={`${confirmHeading ? 'warning' : ''}`} children={<Heading />} onClick={() => {editor.chain().focus().toggleHeading({ level: selectedHeading }).run(); setConfirmHeading(false)}}/>
          {/* TODO - Review if heading apply button is better solution than setting heading styling on selection of heading as implemented below */}
          <select onChange={(changeEvent) => {setSelectedHeading(parseInt(changeEvent.target.value)); setConfirmHeading(true)}} id="heading-select">
          {/* <select onChange={(changeEvent) => {console.log('heading selected'); editor.chain().focus().toggleHeading({ level: parseInt(changeEvent.target.value) }).run()}} id="heading-select"> */}
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>

          <span style={{marginLeft: 'auto'}} className="page-editor-nodes-divider"></span>

          <Button id="page-save-as" children={<FileAdd />} toolTip={"Save As"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} />
          <Button id="page-save" children={<FileDone />} toolTip={"Save"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} disabled={!changesMade} />
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