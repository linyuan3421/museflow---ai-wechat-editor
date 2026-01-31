/**
 * IndexedDB 封装类
 * 用于存储文档历史记录
 */

export interface HistoryDocument {
  id?: number;
  content: string;
  documentId: string;
  saveTime: Date;
}

export class IndexedDB {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private storeName: string;
  private storeOptions: IDBObjectStoreParameters;
  private storeInitCallback?: (objectStore: IDBObjectStore) => void;

  constructor(options: {
    name: string;
    storeName: string;
    storeOptions?: IDBObjectStoreParameters;
    storeInit?: (objectStore: IDBObjectStore) => void;
  }) {
    this.dbName = options.name;
    this.storeName = options.storeName;
    this.storeOptions = options.storeOptions || { keyPath: 'id', autoIncrement: true };

    if (options.storeInit) {
      this.storeInitCallback = options.storeInit;
    }
  }

  async init(): Promise<IDBDatabase> {
    const indexedDB = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB;

    if (!indexedDB) {
      throw new Error('浏览器不支持 IndexedDB');
    }

    const request = indexedDB.open(this.dbName);

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject(new Error('初始化 IndexedDB 失败'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log(`[IndexedDB] 成功初始化数据库: ${this.dbName}`);
        resolve(this.db);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        this.initStore(db, this.storeName, this.storeOptions);
      };
    });
  }

  private initStore(
    db: IDBDatabase,
    name: string,
    options: IDBObjectStoreParameters
  ): void {
    if (!db.objectStoreNames.contains(name)) {
      const objectStore = db.createObjectStore(name, options);

      // 创建索引
      if (!objectStore.indexNames.contains('documentId')) {
        objectStore.createIndex('documentId', 'documentId', { unique: false });
      }
      if (!objectStore.indexNames.contains('saveTime')) {
        objectStore.createIndex('saveTime', 'saveTime', { unique: false });
      }

      console.log(`[IndexedDB] 创建对象存储: ${name}`);

      // 调用用户提供的初始化回调
      if (this.storeInitCallback) {
        this.storeInitCallback(objectStore);
      }
    }
  }

  async getAll(documentId?: string): Promise<HistoryDocument[]> {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);

      let request: IDBRequest;

      if (documentId) {
        // 按 documentId 查询
        const index = objectStore.index('documentId');
        request = index.getAll(documentId);
      } else {
        // 查询所有
        request = objectStore.getAll();
      }

      request.onsuccess = () => {
        const results = request.result as HistoryDocument[];
        // 按 saveTime 降序排序（最新的在前）
        results.sort((a, b) => b.saveTime.getTime() - a.saveTime.getTime());
        resolve(results);
      };

      request.onerror = () => {
        reject(new Error('获取历史记录失败'));
      };
    });
  }

  async add(document: HistoryDocument): Promise<number> {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.add(document);

      request.onsuccess = () => {
        const id = request.result as number;
        console.log(`[IndexedDB] 添加历史记录: id=${id}`);
        resolve(id);
      };

      request.onerror = () => {
        reject(new Error('添加历史记录失败'));
      };
    });
  }

  async update(document: HistoryDocument): Promise<void> {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.put(document);

      request.onsuccess = () => {
        console.log(`[IndexedDB] 更新历史记录: id=${document.id}`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('更新历史记录失败'));
      };
    });
  }

  async delete(id: number): Promise<void> {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log(`[IndexedDB] 删除历史记录: id=${id}`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('删除历史记录失败'));
      };
    });
  }

  async clear(): Promise<void> {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log(`[IndexedDB] 清空历史记录`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('清空历史记录失败'));
      };
    });
  }

  // 获取单个文档
  async get(id: number): Promise<HistoryDocument | undefined> {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);

      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result as HistoryDocument);
      };

      request.onerror = () => {
        reject(new Error('获取历史记录失败'));
      };
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('[IndexedDB] 关闭数据库连接');
    }
  }
}
