// ローカルストレージのキーの定義
const STORAGE_KEY = "gameRecordApp";

// 各記録の要素の定義
const playDateInput = document.getElementById('playDate');
const gameTitleInput = document.getElementById('gameTitle');
const playTimeInput = document.getElementById('playTime');
const gameNotesInput = document.getElementById('gameNotes');
const saveBtn = document.getElementById('saveBtn');
const recordList = document.getElementById('recordList');
const recordCountSpan = document.getElementById('recordCount');

// 空の配列を定義
let myRecords = [];

// ページが読み込まれたときの処理
window.addEventListener('load', () => {
    // 日付をデフォルトで今日に設定
    playDateInput.valueAsDate = new Date();

    const json = localStorage.getItem(STORAGE_KEY);
    if (json) { //  もしローカルストレージにデータがあれば変数に代入
        myRecords = JSON.parse(json);
    }
    renderRecords(); // 初期表示として一覧を表示
});

// 保存ボタンが押されたときに処理
saveBtn.addEventListener('click', () => {
    // 全ての入力欄の情報を変数に代入
    const date = playDateInput.value;
    const title = gameTitleInput.value;
    const time = playTimeInput.value;
    const notes = gameNotesInput.value;

    // タイトルまたは時間が未入力の場合はアラートで知らせる
    if (title === '' || time === '') {
        alert('タイトルと時間は必須入力です');
        return; 
    }

    // 全ての入力データを１つのオブジェクトとしてまとめる
    const newRecord = {
        id: Date.now(), // 今のデータの数を判断し、一意のIDを設定（削除用に使用）
        date: date,
        title: title,
        time: time,
        notes: notes
    };

    // 入力値を配列に追加
    myRecords.unshift(newRecord);
    console.log(myRecords);
    // ローカルストレージに保存
    saveToStorage();
    // 入力欄をリセット
    gameTitleInput.value = '';
    playTimeInput.value = '';
    gameNotesInput.value = '';
    
    renderRecords();
});

// 記録一覧を表示する関数
function renderRecords() {
    recordList.innerHTML = ''; // 一旦リストを空にする
    recordCountSpan.textContent = myRecords.length; // 記録数を表示

    myRecords.forEach(record => {
        const li = document.createElement('li');
        li.className = 'record-item';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'record-header';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = '📅 ' + record.date;

        const timeSpan = document.createElement('span');
        timeSpan.textContent = '⏱ ' + record.time + '分';

        headerDiv.appendChild(dateSpan);
        headerDiv.appendChild(timeSpan);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'game-title';
        titleDiv.textContent = record.title;

        const noteP = document.createElement('p');
        noteP.textContent = record.notes;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        
        // 削除ボタンが押されたとき
        deleteBtn.addEventListener('click', () => {
            deleteRecord(record.id);
        });

        li.appendChild(headerDiv);
        li.appendChild(titleDiv);
        li.appendChild(noteP);
        li.appendChild(deleteBtn);

        recordList.appendChild(li);
    });
}

// 記録を削除する関数
function deleteRecord(id) {
    if (!confirm('本当に削除しますか？')) return;

    myRecords = myRecords.filter(record => record.id !== id); // filterで削除対象を抽出
    saveToStorage();
    renderRecords();
}

// ローカルストレージに保存する関数
function saveToStorage() {
    const json = JSON.stringify(myRecords); // 配列をJSON文字列に変換
    localStorage.setItem(STORAGE_KEY, json); // ローカルストレージに保存
}