// services/database.ts
import { TContract } from '../module/contract/contract.interface';
import db from './firebase';
import { CollectionReference } from 'firebase-admin/firestore';


const contractCollection = ():  CollectionReference<Partial<TContract>> => {
  return db.collection('contracts') as CollectionReference<Partial<TContract>>;
};

const database = {
  contractCollection,
};

export default database;


