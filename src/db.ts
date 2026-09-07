// src/db.ts
import Database from 'better-sqlite3';

const db = new Database('tickets.db');

// テーブル初期化
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 初期データの挿入（0件の場合のみ）
const countRow = db.prepare('SELECT COUNT(*) AS count FROM tickets').get() as { count: number };
if (countRow.count === 0) {
  db.prepare(`
    INSERT INTO tickets (title, description, status)
    VALUES ('ログインができません', 'パスワード再設定用のメールが届きません。', 'open')
  `).run();
  console.log('初期データを挿入しました。');
}

// 1. チケット新規作成 (POST用)
export function createTicket(title: string, description?: string) {
  const stmt = db.prepare('INSERT INTO tickets (title, description) VALUES (?, ?)');
  const result = stmt.run(title, description || '');
  return { id: result.lastInsertRowid, title, description, status: 'open' };
}

// 2. チケット一覧取得 (GET用)
export function getTickets() {
  return db.prepare('SELECT * FROM tickets').all();
}

// 3. チケット更新 (PUT/PATCH用)
export function updateTicket(id: number, title?: string, description?: string, status?: string) {
  // 1. 既存のチケット情報を取得
  const existing = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id) as any;
  if (!existing) return null;

  // 2. undefined（渡されなかった値）の場合は既存の値を維持する
  const newTitle = title !== undefined ? title : existing.title;
  const newDescription = description !== undefined ? description : existing.description;
  const newStatus = status !== undefined ? status : existing.status;

  // 3. 値を確実に設定してUPDATEを実行
  const stmt = db.prepare(`
    UPDATE tickets 
    SET title = ?, 
        description = ?,
        status = ? 
    WHERE id = ?
  `);

  stmt.run(newTitle, newDescription, newStatus, id);

  // 4. 更新後の最新データを返す
  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
}

// 4. チケット削除 (DELETE用)
export function deleteTicket(id: number) {
  const stmt = db.prepare('DELETE FROM tickets WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}