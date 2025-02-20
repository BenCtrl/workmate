import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { info, warn } from '@tauri-apps/plugin-log';

import { Button, Input } from '../CommonComponents'
import PageListItem from '../pages/PageListItem';
import { FileAdd, Search } from '../Icons';

import '../../styling/pagelist.css';

import database from '../../database/database';

const Pages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const fetchPages = async () => {
    try {
      const pages = await database.select('SELECT * FROM pages;');

      if (pages.length > 0) {
        info('Successfully retrieved all pages');
        setPages(pages);
      } else {
        warn('No pages returned');
      }
    } catch(error) {
      console.error(`Error while retrieving pages: ${error}`);
    }
  };

  const deletePage = async (id) => {
    try {
      const results = await database.execute('DELETE FROM pages WHERE id = $1;', [id]);

      info(`Successfully deleted page with ID '${id}'`);
      fetchPages();
    } catch(error) {
      console.error(`Error while deleting page with ID '${id}': ${error}`);
    }
  }

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <>
      <div id="pages-controls">
        <Button className="page-control" style={{marginLeft: '0', marginRight: 'auto'}} children={<FileAdd />} toolTip={"Create new page"} onClick={() => {navigateTo("/pages/editor")}}/>
        <Input icon={<Search />} id="pages-search" className="search-input page-control" placeholder="Search Pages..." value={searchQuery} onChange={(changeEvent) => {setSearchQuery(changeEvent.target.value)}} />
      </div>

      <ul id="pages-list">
        {
          // TODO - Don't really like duplication of return line
          pages.map((page) => {
            if (searchQuery.length <= 0) {
              return <PageListItem key={page.id} page={page} deletePage={deletePage} />
            }
            else if (page.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              return <PageListItem key={page.id} page={page} deletePage={deletePage} />
            }
          })
        }
      </ul>
    </>
  )
}

const addPageLoader = async (newPage) => {
  try {
    const res = await database.select('INSERT INTO pages (title, page_content) VALUES ($1, $2) RETURNING id;', [newPage.title, newPage.page_content]);

    if (res.length > 0) {
      info(`Successfully created new page with ID '${res[0].id}'`);
      return res[0].id;
    } else {
      warn('Attempted to create new page but no ID was returned');
      return;
    }
  } catch(error) {
    console.error(`Error while creating new page: ${error}`);
  }
}

const updatePageLoader = async (page) => {
  try {
    const response = await database.select('UPDATE pages SET title = $1, page_content = $2, edited_timestamp = $3 WHERE id = $4;', [page.title, page.page_content, page.edited_timestamp, page.id]);

    info(`Successfully upated page with ID '${page.id}'`);
    return response;
  } catch(error) {
    console.error(`Error while updating page with ID '${page.id}': ${error}`);
  }
}

export {Pages as default, addPageLoader, updatePageLoader}