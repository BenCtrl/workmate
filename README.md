# Workmate (0.1.0)

Simple work planner app, designed for ease of use & convenience over power. For version 0.1 abilities of this application will be
 - 'Sticky notes' for quick notes, they can be created & organised in groups.
 - 'Pages' for detailed and well annotated documentation. They are endless, single page documents with a number of formatting features available.
 - 'Calendar' is a standard planner calendar, with the feature of being able to create scheduled events on chosen days.

 ## Demonstration Screenshots

![workmate sticky notes](demo/screenshots/stickynotes.png)
![workmate page editor](demo/screenshots/page-editor.png)
![workmate calendar](demo/screenshots/calendar.png)
![workmate app settings](demo/screenshots/settings.png)

## Development Installation
1. Install the nodejs dependencies using `npm i`

2. In two separate terminals run the following commands:
    #### To boot up the REACT environment
    `npm run dev`
    #### To boot up the ExpressJS API service
    `npm run server`

3. Move the file named `[MOVE-TO-SRC]app_settings.json` from the `demo/` folder to the `src/` folder.
    Ensuring to remove the `[MOVE-TO-SRC]` prefix!

4. Open up your browser and search for `http://localhost:5173/` the app should successfully load!

## How it works
The frontend is a typical `REACT` implementation, paired with a backend combination service of `ExpressJS`, as an API & `sqlite`, as a local database.
Assuming the installation steps were followed and the application has started up successfully, the backend service should automatically generate two files:
 - `workmate.db` : An essential file that contains all the data & entities (aside from app configuration data) managed by workmate.
 - `workmate.log` : A log store for all logging messages created by the application, the default level is `DEBUG` (for console log messages it is `INFO`).

Note: In development setups the default destination for these two files is always the **root directory of the project**.

The third required file, `app_settings.json` is provided in the `demo` folder. This file must be present in the `/src` directory of the project in order for application settings to be applied.
