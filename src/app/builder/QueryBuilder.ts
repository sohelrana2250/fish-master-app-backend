import {
  CollectionReference,
  Query,
  Timestamp,
} from 'firebase-admin/firestore';

class FirebaseQueryBuilder<T> {
  public firestoreQuery: Query;
  public query: Record<string, unknown>;
  private collectionRef: CollectionReference;

  constructor(
    collectionRef: CollectionReference,
    query: Record<string, unknown>,
  ) {
    this.collectionRef = collectionRef;
    this.firestoreQuery = collectionRef;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;

    if (searchTerm) {
      if (searchableFields.length > 0) {
        let query = this.collectionRef
          .where(searchableFields[0], '>=', searchTerm)
          .where(searchableFields[0], '<=', searchTerm + '\uf8ff');

        for (let i = 1; i < searchableFields.length; i++) {
          query = query
            .where(searchableFields[i], '>=', searchTerm)
            .where(searchableFields[i], '<=', searchTerm + '\uf8ff');
        }

        this.firestoreQuery = query;
      }
    }

    return this;
  }

  filter() {
    let queryObject = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    if (this.query && this.query.maxPrice) {
      this.firestoreQuery = this.firestoreQuery
        .where('price', '>=', Number(this.query.minPrice))
        .where('price', '<=', Number(this.query.maxPrice));
    }

    if (this.query?.releaseDate) {
      const releaseDate = this.query.releaseDate as string;
      this.firestoreQuery = this.firestoreQuery.where(
        'releaseDate',
        '==',
        releaseDate,
      );
    }

    Object.entries(queryObject).forEach(([field, value]) => {
      this.firestoreQuery = this.firestoreQuery.where(field, '==', value);
    });

    return this;
  }

  sort() {
    if (this.query?.sort) {
      const sortFields = (this.query.sort as string).split(',');

      sortFields.forEach((field) => {
        const direction = field.startsWith('-') ? 'desc' : 'asc';
        const fieldName = field.startsWith('-') ? field.substring(1) : field;
        this.firestoreQuery = this.firestoreQuery.orderBy(fieldName, direction);
      });
    } else {
      this.firestoreQuery = this.firestoreQuery.orderBy('createdAt', 'desc');
    }

    return this;
  }

  paginate() {
    const limit = Math.max(Number(this.query.limit) || 10, 1);
    const page = Math.max(Number(this.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    this.firestoreQuery = this.firestoreQuery.limit(limit);

    if (offset > 0) {
      this.firestoreQuery = this.firestoreQuery.offset(offset);
    }

    return this;
  }

  fields() {
    if (this.query?.fields) {
      this.selectFields = (this.query.fields as string).split(',');
    }
    return this;
  }

  private selectFields: string[] = [];

  private formatTimestamps(data: any): any {
    if (!data) return data;

    if (typeof data === 'object' && data !== null) {
      if (data instanceof Timestamp) {
        return data.toDate().toISOString();
      }

      if (data._seconds !== undefined && data._nanoseconds !== undefined) {
        return new Date(
          data._seconds * 1000 + data._nanoseconds / 1000000,
        ).toISOString();
      }

      if (Array.isArray(data)) {
        return data.map((item) => this.formatTimestamps(item));
      }

      const result: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          result[key] = this.formatTimestamps(data[key]);
        }
      }
      return result;
    }

    return data;
  }

  async execute(): Promise<T[]> {
    const snapshot = await this.firestoreQuery.get();

    return snapshot.docs.map((doc) => {
      let data = doc.data() as any;

      data = this.formatTimestamps(data);

      data.id = doc.id;

      if (this.selectFields.length > 0) {
        const selectedData = {} as Partial<T>;

        selectedData['id' as keyof T] = doc.id as any;

        this.selectFields.forEach((field) => {
          const key = field as keyof T;
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            selectedData[key] = data[key];
          }
        });
        return selectedData as unknown as T;
      }

      return data as T;
    });
  }

  async countTotal() {
    const snapshot = await this.firestoreQuery.get();
    const total = snapshot.size;

    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default FirebaseQueryBuilder;
