// src/server.ts
import express from 'express';
import { createTicket, getTickets, updateTicket, deleteTicket } from './db';
import path from 'path';

const app = express();
const PORT = 3000;

// リクエストボディ（JSONデータ）を解析するためのミドルウェア
app.use(express.json());

// 静的ファイル（HTML, CSS, JS）の配信設定
app.use(express.static(path.join(__dirname, '../public')));

// 1. GET: チケット一覧取得
app.get('/tickets', (req, res) => {
  try {
    const tickets = getTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'データの取得に失敗しました。' });
  }
});

// 2. POST: チケット新規作成
app.post('/tickets', (req, res) => {
  try {
    const { title, description } = req.body;
    
    // バリデーション：title は必須
    if (!title) {
      return res.status(400).json({ error: 'タイトル(title)は必須です。' });
    }

    const newTicket = createTicket(title, description);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: 'チケットの作成に失敗しました。' });
  }
});

// 3. PATCH: チケット更新
app.patch('/tickets/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status } = req.body;

    // db.ts 側の定義順 (id, title, description, status) で呼び出す
    const updatedTicket = updateTicket(id, title, description, status);

    if (!updatedTicket) {
      return res.status(404).json({ error: '指定されたチケットが見つかりません。' });
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error('更新エラー:', error);
    res.status(500).json({ error: 'チケットの更新に失敗しました。' });
  }
});

// 4. DELETE: チケット削除
app.delete('/tickets/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const success = deleteTicket(id);

    if (!success) {
      return res.status(404).json({ error: '指定されたチケットが見つかりません。' });
    }

    res.json({ message: 'チケットを正常に削除しました。' });
  } catch (error) {
    res.status(500).json({ error: 'チケットの削除に失敗しました。' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});