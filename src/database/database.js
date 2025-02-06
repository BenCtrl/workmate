import Database from "@tauri-apps/plugin-sql";

export default await Database.load('sqlite:workmate.db');