type UsageGuideModalProps = {
  onClose: () => void;
};

/**
 * 使い方を表示するためのモーダル。
 * 初めて触る人が、作成・記録・保存の流れを短く確認できるようにまとめる。
 */
export function UsageGuideModal({ onClose }: UsageGuideModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="usage-guide-title">
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="閉じる">
          ×
        </button>
        <header className="modal__header">
          <h2 id="usage-guide-title">使い方</h2>
        </header>

        <div className="modal__scroll-body usage-guide">
          <section>
            <h3>新規作成</h3>
            <p>一覧画面の「新規作成」からログを作成します。編成を登録すると、ログが一覧に保存されます。</p>
          </section>

          <section>
            <h3>編成編集</h3>
            <p>キャラ名、魔道具、備考、色を設定できます。キャラを削除した場合、そのキャラの行動ログも整理されます。</p>
          </section>

          <section>
            <h3>ログの追加</h3>
            <p>タイム、キャラ、行動、備考を入力します。1つのタイムに複数キャラの行動を登録できます。</p>
            <p>行動が未入力でも、キャラと備考だけで保存できます。</p>
          </section>

          <section>
            <h3>保存・共有</h3>
            <p>画像保存は共有用、テキストでコピーはDiscordなどへの貼り付け用です。</p>
            <p>一覧画面ではすべてのログをJSON保存できます。詳細画面では開いているログだけをJSON保存できます。</p>
            <p>JSON取込で保存したデータを復元できます。</p>
          </section>

          <section>
            <h3>複製・削除</h3>
            <p>一覧画面でログを複製できます。詳細画面では行動ログだけをクリアするか、ログ自体を削除できます。</p>
          </section>

          <section>
            <h3>データについて</h3>
            <p>入力したデータはこの端末のブラウザ内にのみ保存され、外部へ送信されません。</p>
            <p>ブラウザのデータ削除を行うと、保存内容も消える場合があります。</p>
          </section>
        </div>
      </section>
    </div>
  );
}
