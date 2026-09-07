let editingTicketId = null; // 現在編集中のチケットID（null の時は新規作成モード）

// 画面ロード時にチケット一覧を取得
document.addEventListener('DOMContentLoaded', fetchTickets);

// フォーム送信イベントの監視（新規作成 / 編集 兼用）
document.getElementById('ticket-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const ticketData = {
    title: titleInput.value,
    description: descriptionInput.value
  };

  try {
    let response;

    if (editingTicketId) {
      // 編集モード：PATCH リクエストを送信
      response = await fetch(`/tickets/${editingTicketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
    } else {
      // 新規作成モード：POST リクエストを送信
      response = await fetch('/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
    }

    if (response.ok) {
      // フォームと編集状態のリセット
      titleInput.value = '';
      descriptionInput.value = '';
      editingTicketId = null;
      submitBtn.textContent = '投稿する';

      fetchTickets(); // 一覧を再取得して更新
    } else {
      alert(editingTicketId ? 'チケットの更新に失敗しました' : 'チケットの作成に失敗しました');
    }
  } catch (error) {
    console.error('エラー:', error);
  }
});

// チケット一覧取得 API 実行
async function fetchTickets() {
  try {
    const response = await fetch('/tickets');
    const tickets = await response.json();
    renderTickets(tickets);
  } catch (error) {
    console.error('エラー:', error);
  }
}

// 画面描画関数（枠線用クラス ticket-item を適用）
function renderTickets(tickets) {
  const ticketList = document.getElementById('ticket-list');
  ticketList.innerHTML = '';

  tickets.forEach(ticket => {
    const item = document.createElement('div');
    item.className = 'ticket-item';

    item.innerHTML = `
      <div class="ticket-info">
        <strong>${escapeHtml(ticket.title)}</strong>
        <p style="margin: 4px 0 0; color: #666;">${escapeHtml(ticket.description || '')}</p>
      </div>
      <div class="ticket-actions" style="margin-top: 8px;">
        <button class="edit-btn">編集</button>
        <button class="delete-btn" onclick="deleteTicket(${ticket.id})">削除</button>
      </div>
    `;

    // 編集ボタンへのイベントリスナー設定（IDとデータを安全に渡す）
    const editBtn = item.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      editTicket(ticket.id, ticket.title, ticket.description || '');
    });

    ticketList.appendChild(item);
  });
}

// 編集ボタン押下時の処理：フォームに既存データをセット
function editTicket(id, title, description) {
  editingTicketId = id; // ★ここで確実に編集対象のIDをセット
  
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;

  // ボタンの表示を「更新する」に変更
  const submitBtn = document.querySelector('#ticket-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = '更新する';
  }

  // フォームまでスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// チケット削除処理
async function deleteTicket(id) {
  if (!confirm('本当に削除しますか？')) return;

  try {
    const response = await fetch(`/tickets/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchTickets();
    } else {
      alert('削除に失敗しました');
    }
  } catch (error) {
    console.error('エラー:', error);
  }
}

// XSS対策用エスケープ関数（HTML出力用）
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// JS文字列クォート用エスケープ関数（onclick属性内用）
function escapeJsString(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n');
}