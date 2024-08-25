// import * as SQLite from "expo-sqlite";

// const db = SQLite.openDatabaseAsync("notes.db");

// export const createNoteTable = async () => {
//   try {
//     await (
//       await db
//     ).execAsync(
//       `
//             PRAGMA journal_mode = WAL;
//             CREATE TABLE IF NOT EXISTS notes (
//               id INTEGER PRIMARY KEY AUTOINCREMENT,
//               title TEXT,
//               content TEXT,
//               created_at TEXT,
//               updated_at TEXT
//             );
//             INSERT INTO notes (title, content, created_at, updated_at) VALUES ('Sample Note 1', 'This is a sample note.', datetime('now'), datetime('now'));
//             INSERT INTO notes (title, content, created_at, updated_at) VALUES ('Sample Note 2', 'This is another sample note.', datetime('now'), datetime('now'));
//           `
//     );
//     console.log("Table created and sample data inserted successfully");
//   } catch (error) {
//     console.error("Error creating table or inserting data:", error);
//   }
// };
