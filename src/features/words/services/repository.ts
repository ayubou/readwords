import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
  type DocumentReference,
  type DocumentData,
} from "firebase/firestore";
import { Word } from "@/features/words/types/word";

/**
 * 単語一覧を購読
 * @param callback 取得したリストを受け取るコールバック
 * @returns Unsubscribe（購読解除用）
 */
export function subscribeWords(callback: (words: Word[]) => void): Unsubscribe {
  const col = () => collection(db, "words");
  const q = query(col(), orderBy("name"));

  return onSnapshot(q, (querySnapshot) => {
    const list: Word[] = [];
    querySnapshot.forEach((d) => {
      const data = d.data() as Omit<Word, "id">;
      list.push({ id: d.id, ...data });
    });
    callback(list);
  });
}

/**
 * 単語登録
 * @param input 登録内容
 * @returns ID
 */
export async function createWord(input: {
  name: string;
  kana: string;
  detail: string;
}): Promise<DocumentReference<DocumentData, DocumentData>> {
  return await addDoc(collection(db, "words"), input);
}

/**
 * 単語更新
 * @param id 単語ID
 * @param input 更新内容
 */
export async function updateWord(
  id: string,
  input: {
    name: string;
    kana: string;
    detail: string;
  }
): Promise<void> {
  await updateDoc(doc(db, "words", id), input);
}

/**
 * 単語更新
 * @param id 単語ID
 */
export async function deleteWord(id: string): Promise<void> {
  await deleteDoc(doc(db, "words", id));
}
