import { useMemo, useEffect, useRef, useState } from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeTest";

const dummyList = [
  {
    id: 1,
    author: "신동주",
    content: "hi1",
    emotion: 5,
    created_date: new Date().getTime(),
  },
  {
    id: 2,
    author: "홍길동",
    content: "hi2",
    emotion: 3,
    created_date: new Date().getTime(),
  },
  {
    id: 3,
    author: "아무개",
    content: "hi3",
    emotion: 2,
    created_date: new Date().getTime(),
  },
];

function App() {
  const [data, setData] = useState([]);

  const dataId = useRef(1);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const InitData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    setData(InitData);
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
  };

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  };

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div>
      <OptimizeTest />
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 개수 : {data.length}</div>
      <div>좋은 일기 개수 : {goodCount}</div>
      <div>나쁜 일기 개수 : {badCount}</div>
      <div>좋은 일기 비율 : {goodRatio}</div>

      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
