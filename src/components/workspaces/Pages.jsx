import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { info, warn } from '@tauri-apps/plugin-log';

import { Button, Input } from '../CommonComponents'
import PageListItem from '../pages/PageListItem';
import { IconFileAdd, IconSearch } from '../Icons';

import '../../styling/pagelist.css';

import database from '../../database/database';

const Pages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const getPages = async () => {
    try {
      const pages = await database.select('SELECT * FROM pages;');

      if (pages.length > 0) {
        info('Successfully retrieved all pages');
      } else {
        warn('No pages returned');
      }

      setPages(pages);
    } catch(error) {
      console.error(`Error while retrieving pages: ${error}`);
    }
  };

  const deletePage = async (page) => {
    try {
      await database.execute('DELETE FROM pages WHERE id = $1;', [page.id]);

      info(`Successfully deleted page '${page.title}' [ID: '${page.id}']`);
      getPages();
    } catch(error) {
      console.error(`Error while deleting page '${page.title}' [ID: '${page.id}']: ${error}`);
    }
  }

  useEffect(() => {
    getPages();
  }, []);

  return (
    <>
      <div className='workspace-controls'>
        <Button children={<IconFileAdd />} toolTip={"Create new page"} onClick={() => {navigateTo("/pages/editor")}}/>
        <Input icon={<IconSearch />} id="pages-search" className="search-input" placeholder="Search Pages..." value={searchQuery} onChange={(changeEvent) => {setSearchQuery(changeEvent.target.value)}} />
      </div>

      <ul id="pages-list" className="scrollable">
        {
          pages.map((page) => {
            const pageListItem = <PageListItem key={page.id} page={page} deletePage={deletePage} />

            if (searchQuery.length <= 0) {
              return pageListItem;
            }
            else if (page.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              return pageListItem;
            }
          })
        }
      </ul>
    </>
  )
}

export default Pages;