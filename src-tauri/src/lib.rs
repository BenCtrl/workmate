use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let migrations = vec![
    Migration {
      version: 1,
      description: "create notes table",
      sql: "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, content TEXT NOT NULL, completed INTEGER NOT NULL, created_timestamp INTEGER DEFAULT(unixepoch('subsec') * 1000), edited_timestamp INTEGER DEFAULT(unixepoch('subsec') * 1000), group_id INTEGER NOT NULL, FOREIGN KEY (group_id) REFERENCES note_groups (id));",
      kind: MigrationKind::Up,
    },
    Migration {
      version: 2,
      description: "create note groups table",
      sql: "CREATE TABLE IF NOT EXISTS note_groups (id INTEGER PRIMARY KEY, title TEXT NOT NULL, color TEXT NOT NULL);",
      kind: MigrationKind::Up,
    },
    Migration {
      version: 3,
      description: "create pages table",
      sql: "CREATE TABLE IF NOT EXISTS pages (id INTEGER PRIMARY KEY, title TEXT NOT NULL, page_content TEXT NOT NULL, created_timestamp INTEGER DEFAULT(unixepoch('subsec') * 1000) NOT NULL, edited_timestamp INTEGER DEFAULT(unixepoch('subsec') * 1000));",
      kind: MigrationKind::Up,
    },
    Migration {
      version: 4,
      description: "create events groups table",
      sql: "CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, title TEXT NOT NULL, event_timestamp INTEGER DEFAULT(unixepoch('subsec') * 1000) NOT NULL);",
      kind: MigrationKind::Up,
    },
    Migration {
      version: 5,
      description: "create default note group",
      sql: "INSERT INTO note_groups (title, color) VALUES ('Sticky Notes', 'yellow');",
      kind: MigrationKind::Up,
    },
  ];

  tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(
      tauri_plugin_sql::Builder::new()
        .add_migrations("sqlite:workmate.db", migrations)
        .build(),
    )
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Trace)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
