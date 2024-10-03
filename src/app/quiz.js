'use client'; // クライアントコンポーネントとしてマーク

import { useState, useEffect } from 'react';

const Quiz = ({ questions }) => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('text-green-400'); // デフォルトの色を緑に設定
  const [isCooldown, setIsCooldown] = useState(false); // クールダウン状態を管理

  // 質問をランダムにシャッフルする関数
  const shuffleQuestions = (questions) => {
    return questions.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const shuffled = shuffleQuestions([...questions]);
    setShuffledQuestions(shuffled); // 質問をシャッフルして保存
    setCurrentQuestionIndex(0); // インデックスをリセット
  }, [questions]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    if (!currentQuestion) {
      return; // 現在の質問が無効な場合は何もしない
    }

    if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setScore(score + 1);
      setFeedback(`正解です。${currentQuestion.answer}, ${currentQuestion.description}です。`);
      setFeedbackColor('text-green-400'); // 正解の場合の色
    } else {
      setFeedback(`不正解です。正答は${currentQuestion.answer}。${currentQuestion.description}です。`);
      setFeedbackColor('text-red-400'); // 不正解の場合の色
    }

    // クールダウンを設定
    setIsCooldown(true);
    setUserAnswer(''); // 入力フィールドをクリア

    const nextQuestion = currentQuestionIndex + 1;

    setTimeout(() => {
      // フィードバックをリセット
      setFeedback('');
      setFeedbackColor('text-green-400'); // デフォルトの色に戻す
      
      if (nextQuestion < shuffledQuestions.length) {
        setCurrentQuestionIndex(nextQuestion);
      } else {
        setShowScore(true);
      }
      setIsCooldown(false); // クールダウンが終わったら無効にする
    }, 2000); // 2000ミリ秒（2秒）のクールダウン
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setShowScore(false);
    setFeedback('');
    setFeedbackColor('text-green-400'); // リトライ時はデフォルトの色に戻す
    setShuffledQuestions(shuffleQuestions([...questions])); // リトライ時に再シャッフル
  };

  // シャッフルされた質問が存在する場合のみ表示
  if (shuffledQuestions.length === 0) {
    return <p>読み込み中...</p>; // 質問がまだシャッフルされていない場合
  }

  return (
    <div>
      {showScore ? (
        <div>
          <h2 className="text-xl">あなたのスコア: {score} / {shuffledQuestions.length}</h2>
          <button onClick={handleRetry} className="mt-4 p-2 bg-blue-600 rounded">
            リトライ
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg">{shuffledQuestions[currentQuestionIndex].question}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="mt-2 p-2 bg-gray-800 border border-gray-600 rounded"
              placeholder="あなたの答え"
            />
            <button type="submit" className={`mt-2 p-2 bg-blue-600 rounded ${isCooldown ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isCooldown}>
              次へ
            </button>
          </form>
          {feedback && <p className={`mt-2 ${feedbackColor}`}>{feedback}</p>} {/* フィードバックの色を適用 */}
          {isCooldown && <p className="mt-2 text-gray-400">次の問題に進むまでお待ちください...</p>}
        </div>
      )}
    </div>
  );
};

export default Quiz;

